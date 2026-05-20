package com.pqrs.system_pqrs.config;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.UpdateOneModel;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Migración one-time: transforma documentos del schema SQL-like al nuevo schema MongoDB con enums.
 * Detecta documentos no migrados por presencia de campos legacy (rol como objeto, estado como objeto).
 */
@Component
public class DataMigrationRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataMigrationRunner.class);

    private static final Map<String, String> ROL_MAP = Map.of(
            "administrador", "ADMIN",
            "admin", "ADMIN",
            "residente", "RESIDENTE"
    );

    private static final Map<String, String> ESTADO_MAP = Map.of(
            "pendiente", "PENDIENTE",
            "asignada", "ASIGNADA",
            "resuelta", "RESUELTA",
            "en proceso", "ASIGNADA",
            "en_proceso", "ASIGNADA"
    );

    private static final Map<String, String> TIPO_MAP = Map.of(
            "petición", "PETICION",
            "peticion", "PETICION",
            "queja", "QUEJA",
            "reclamo", "RECLAMO",
            "sugerencia", "SUGERENCIA"
    );

    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;

    public DataMigrationRunner(MongoTemplate mongoTemplate, PasswordEncoder passwordEncoder) {
        this.mongoTemplate = mongoTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        migrarMiembros();
        migrarPeticiones();
        migrarHistorialPeticionId();
    }

    private void migrarMiembros() {
        MongoCollection<Document> col = mongoTemplate.getCollection("miembro");

        // Eliminar índices legacy del schema SQL que bloquean la migración
        try {
            col.dropIndex("_RM_codeMiembro");
            log.info("Índice legacy _RM_codeMiembro eliminado");
        } catch (Exception ignored) {}
        try {
            col.dropIndex("correo_Miembro_1");
            log.info("Índice legacy correo_Miembro_1 eliminado");
        } catch (Exception ignored) {}

        List<UpdateOneModel<Document>> bulk = new ArrayList<>();

        for (Document doc : col.find()) {
            List<org.bson.conversions.Bson> updates = new ArrayList<>();
            ObjectId id = doc.getObjectId("_id");

            // Migrar rol: {idRol, nombreRol} → enum string
            Object rolField = doc.get("rol");
            if (rolField instanceof Document rolDoc) {
                String nombreRol = rolDoc.getString("nombreRol");
                if (nombreRol != null) {
                    String enumVal = ROL_MAP.getOrDefault(nombreRol.toLowerCase(), "RESIDENTE");
                    updates.add(Updates.set("rol", enumVal));
                }
            } else if (rolField instanceof Integer rolInt) {
                String enumVal = rolInt == 2 ? "ADMIN" : "RESIDENTE";
                updates.add(Updates.set("rol", enumVal));
            }

            // Migrar password plano → BCrypt
            String pwd = doc.getString("passwordMiembro");
            if (pwd != null && !pwd.startsWith("$2a$") && !pwd.startsWith("$2b$")) {
                updates.add(Updates.set("passwordMiembro", passwordEncoder.encode(pwd)));
            }

            if (!updates.isEmpty()) {
                bulk.add(new UpdateOneModel<>(
                        new Document("_id", id),
                        Updates.combine(updates)));
            }
        }

        if (!bulk.isEmpty()) {
            col.bulkWrite(bulk);
            log.info("Miembros migrados: {}", bulk.size());
        } else {
            log.info("Miembros: sin cambios pendientes");
        }
    }

    private void migrarPeticiones() {
        MongoCollection<Document> col = mongoTemplate.getCollection("peticiones");
        List<UpdateOneModel<Document>> bulk = new ArrayList<>();

        for (Document doc : col.find()) {
            List<org.bson.conversions.Bson> updates = new ArrayList<>();
            ObjectId id = doc.getObjectId("_id");

            // Migrar estado: {id, nombre} → enum string
            Object estadoField = doc.get("estado");
            if (estadoField instanceof Document estadoDoc) {
                String nombre = estadoDoc.getString("nombre");
                if (nombre != null) {
                    String enumVal = ESTADO_MAP.getOrDefault(nombre.toLowerCase(), "PENDIENTE");
                    updates.add(Updates.set("estado", enumVal));
                }
            }

            // Migrar tipoPeticion: {id, nombre, tiempo} → enum string
            Object tipoField = doc.get("tipoPeticion");
            if (tipoField instanceof Document tipoDoc) {
                String nombre = tipoDoc.getString("nombre");
                if (nombre != null) {
                    String enumVal = TIPO_MAP.getOrDefault(nombre.toLowerCase(), "PETICION");
                    updates.add(Updates.set("tipoPeticion", enumVal));
                }
            }

            // Migrar campo descripcion si viene como descripcionPeticion
            if (doc.get("descripcion") == null && doc.getString("descripcionPeticion") != null) {
                updates.add(Updates.set("descripcion", doc.getString("descripcionPeticion")));
                updates.add(Updates.unset("descripcionPeticion"));
            }

            if (!updates.isEmpty()) {
                bulk.add(new UpdateOneModel<>(
                        new Document("_id", id),
                        Updates.combine(updates)));
            }
        }

        if (!bulk.isEmpty()) {
            col.bulkWrite(bulk);
            log.info("Peticiones migradas: {}", bulk.size());
        } else {
            log.info("Peticiones: sin cambios pendientes");
        }
    }

    private void migrarHistorialPeticionId() {
        MongoCollection<Document> col = mongoTemplate.getCollection("historialpeticion");
        List<UpdateOneModel<Document>> bulk = new ArrayList<>();

        for (Document doc : col.find()) {
            List<org.bson.conversions.Bson> updates = new ArrayList<>();
            ObjectId docId = doc.getObjectId("_id");

            // peticionId: ObjectId → String
            Object peticionIdField = doc.get("peticionId");
            if (peticionIdField instanceof ObjectId oid) {
                updates.add(Updates.set("peticionId", oid.toHexString()));
            }

            // estado: "Pendiente"/"Asignada"/"Resuelta" → enum PENDIENTE/ASIGNADA/RESUELTA
            String estadoStr = doc.getString("estado");
            if (estadoStr != null && !estadoStr.equals(estadoStr.toUpperCase())) {
                String enumVal = ESTADO_MAP.getOrDefault(estadoStr.toLowerCase(), estadoStr.toUpperCase());
                updates.add(Updates.set("estado", enumVal));
            }

            // responsable.id: Integer → String
            Object responsableField = doc.get("responsable");
            if (responsableField instanceof Document respDoc) {
                Object respId = respDoc.get("id");
                if (respId instanceof Integer respInt) {
                    Document nuevoResponsable = new Document("id", String.valueOf(respInt))
                            .append("nombre", respDoc.getString("nombre"));
                    updates.add(Updates.set("responsable", nuevoResponsable));
                }
            }

            if (!updates.isEmpty()) {
                bulk.add(new UpdateOneModel<>(
                        new Document("_id", docId),
                        Updates.combine(updates)));
            }
        }

        if (!bulk.isEmpty()) {
            col.bulkWrite(bulk);
            log.info("HistorialPeticion migrado: {} docs", bulk.size());
        } else {
            log.info("HistorialPeticion: sin cambios pendientes");
        }
    }
}
