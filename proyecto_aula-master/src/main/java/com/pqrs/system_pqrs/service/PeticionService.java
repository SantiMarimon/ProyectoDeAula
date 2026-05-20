package com.pqrs.system_pqrs.service;

import com.pqrs.system_pqrs.document.Miembro;
import com.pqrs.system_pqrs.document.Peticion;
import com.pqrs.system_pqrs.document.embedded.MiembroRef;
import com.pqrs.system_pqrs.document.embedded.RespuestaEmbedded;
import com.pqrs.system_pqrs.document.enums.EstadoPeticion;
import com.pqrs.system_pqrs.dto.AgregarRespuestaRequest;
import com.pqrs.system_pqrs.dto.CambiarEstadoRequest;
import com.pqrs.system_pqrs.dto.EditarPeticionRequest;
import com.pqrs.system_pqrs.dto.PeticionCreateRequest;
import com.pqrs.system_pqrs.exception.ResourceNotFoundException;
import com.pqrs.system_pqrs.repository.MiembroRepository;
import com.pqrs.system_pqrs.repository.PeticionRepository;
import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PeticionService {

    private final PeticionRepository peticionRepository;
    private final MiembroRepository miembroRepository;
    private final HistorialPeticionService historialService;
    private final MongoTemplate mongoTemplate;

    public PeticionService(PeticionRepository peticionRepository,
                           MiembroRepository miembroRepository,
                           HistorialPeticionService historialService,
                           MongoTemplate mongoTemplate) {
        this.peticionRepository = peticionRepository;
        this.miembroRepository = miembroRepository;
        this.historialService = historialService;
        this.mongoTemplate = mongoTemplate;
    }

    public List<Peticion> findAll() {
        return peticionRepository.findAll();
    }

    public Page<Peticion> findAllPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "_id"));
        return peticionRepository.findAll(pageable);
    }

    public Page<Peticion> findByEstadoPaginado(EstadoPeticion estado, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "_id"));
        return peticionRepository.findByEstado(estado, pageable);
    }

    public Page<Peticion> findByMiembroIdPaginado(String miembroId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "_id"));
        return peticionRepository.findByMiembroId(miembroId, pageable);
    }

    public Page<Peticion> buscarConFiltros(String busqueda, String estado, String tipo, String area, int page, int size) {
        List<Criteria> filtros = new ArrayList<>();
        if (busqueda != null && !busqueda.isBlank()) {
            filtros.add(new Criteria().orOperator(
                Criteria.where("miembro.nombre").regex(busqueda, "i"),
                Criteria.where("asunto").regex(busqueda, "i")
            ));
        }
        if (estado != null && !estado.isBlank()) {
            filtros.add(Criteria.where("estado").is(estado));
        }
        if (tipo != null && !tipo.isBlank()) {
            filtros.add(Criteria.where("tipoPeticion").is(tipo));
        }
        if (area != null && !area.isBlank()) {
            filtros.add(Criteria.where("area").is(area));
        }
        Criteria criteria = filtros.isEmpty() ? new Criteria() : new Criteria().andOperator(filtros.toArray(new Criteria[0]));
        long total = mongoTemplate.count(new Query(criteria), Peticion.class);
        Query query = new Query(criteria)
            .with(Sort.by(Sort.Direction.ASC, "_id"))
            .skip((long) page * size)
            .limit(size);
        List<Peticion> lista = mongoTemplate.find(query, Peticion.class);
        return new PageImpl<>(lista, PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "_id")), total);
    }

    public Map<String, Object> getStats() {
        Aggregation estadoAgg = Aggregation.newAggregation(
            Aggregation.group("estado").count().as("count")
        );
        AggregationResults<Document> estadoRes = mongoTemplate.aggregate(estadoAgg, Peticion.class, Document.class);
        Map<String, Long> estadoMap = new HashMap<>();
        for (Document doc : estadoRes.getMappedResults()) {
            String key = String.valueOf(doc.get("_id"));
            estadoMap.put(key, ((Number) doc.get("count")).longValue());
        }

        Aggregation tipoAgg = Aggregation.newAggregation(
            Aggregation.group("tipoPeticion").count().as("count")
        );
        AggregationResults<Document> tipoRes = mongoTemplate.aggregate(tipoAgg, Peticion.class, Document.class);
        Map<String, Long> tipoMap = new HashMap<>();
        for (Document doc : tipoRes.getMappedResults()) {
            String key = String.valueOf(doc.get("_id"));
            tipoMap.put(key, ((Number) doc.get("count")).longValue());
        }

        Aggregation recientesAgg = Aggregation.newAggregation(
            Aggregation.sort(Sort.by(Sort.Direction.DESC, "fechaCreacion")),
            Aggregation.limit(5)
        );
        AggregationResults<Peticion> recientes = mongoTemplate.aggregate(recientesAgg, Peticion.class, Peticion.class);

        long pendientes = estadoMap.getOrDefault("PENDIENTE", 0L);
        long asignadas = estadoMap.getOrDefault("ASIGNADA", 0L);
        long resueltas = estadoMap.getOrDefault("RESUELTA", 0L);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", pendientes + asignadas + resueltas);
        stats.put("pendientes", pendientes);
        stats.put("asignadas", asignadas);
        stats.put("resueltas", resueltas);
        stats.put("porTipo", Map.of(
            "PETICION",   tipoMap.getOrDefault("PETICION", 0L),
            "QUEJA",      tipoMap.getOrDefault("QUEJA", 0L),
            "RECLAMO",    tipoMap.getOrDefault("RECLAMO", 0L),
            "SUGERENCIA", tipoMap.getOrDefault("SUGERENCIA", 0L)
        ));
        stats.put("recientes", recientes.getMappedResults());
        return stats;
    }

    public Optional<Peticion> findById(String id) {
        return peticionRepository.findById(id);
    }

    public List<Peticion> findByMiembroId(String miembroId) {
        return peticionRepository.findByMiembroId(miembroId);
    }

    public List<Peticion> findByEstado(EstadoPeticion estado) {
        return peticionRepository.findByEstado(estado);
    }

    public Peticion crear(PeticionCreateRequest req, String correoMiembro) {
        Miembro miembro = miembroRepository.findByCorreoMiembro(correoMiembro)
                .orElseThrow(() -> new ResourceNotFoundException("Miembro no encontrado"));

        Peticion peticion = new Peticion();
        peticion.setDescripcion(req.getDescripcion());
        peticion.setTipoPeticion(req.getTipoPeticion());
        peticion.setEstado(EstadoPeticion.PENDIENTE);
        peticion.setFechaCreacion(LocalDateTime.now());
        peticion.setMiembro(new MiembroRef(miembro.getId(), miembro.getNombreCompleto()));
        peticion.setAsunto(req.getAsunto());
        peticion.setArea(req.getArea());
        peticion.setUbicacion(req.getUbicacion());
        peticion.setFechaHecho(req.getFechaHecho());
        peticion.setPersonaInvolucrada(req.getPersonaInvolucrada());
        peticion.setContactoNombre(req.getContactoNombre());
        peticion.setContactoEmail(req.getContactoEmail());
        peticion.setContactoTelefono(req.getContactoTelefono());

        Peticion saved = peticionRepository.save(peticion);

        historialService.registrarEvento(
                saved.getId(), EstadoPeticion.PENDIENTE, null,
                "Petición recibida por la JAC del Barrio Policarpa");

        return saved;
    }

    public Peticion cambiarEstado(String id, CambiarEstadoRequest req, String correoAdmin) {
        Peticion peticion = peticionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Petición no encontrada: " + id));

        MiembroRef responsableRef = null;

        if (req.getResponsableId() != null) {
            Miembro responsable = miembroRepository.findById(req.getResponsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Responsable no encontrado"));
            responsableRef = new MiembroRef(responsable.getId(), responsable.getNombreCompleto());
            peticion.setResponsable(responsableRef);
        }

        peticion.setEstado(req.getNuevoEstado());
        if (req.getFechaEstimadaResolucion() != null) {
            peticion.setFechaEstimadaResolucion(req.getFechaEstimadaResolucion());
        }
        Peticion saved = peticionRepository.save(peticion);

        String observacion = req.getObservacion() != null
                ? req.getObservacion()
                : "Estado actualizado a " + req.getNuevoEstado().name();

        historialService.registrarEvento(saved.getId(), req.getNuevoEstado(), responsableRef, observacion);

        return saved;
    }

    public Peticion agregarRespuesta(String id, AgregarRespuestaRequest req, String correoAdmin) {
        Peticion peticion = peticionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Petición no encontrada: " + id));

        Miembro admin = miembroRepository.findByCorreoMiembro(correoAdmin)
                .orElseThrow(() -> new ResourceNotFoundException("Miembro no encontrado"));

        RespuestaEmbedded respuesta = new RespuestaEmbedded(
                admin.getId(), admin.getNombreCompleto(),
                req.getTexto(), LocalDateTime.now());

        peticion.getRespuestas().add(respuesta);
        return peticionRepository.save(peticion);
    }

    public Peticion editar(String id, EditarPeticionRequest req, String correoMiembro) {
        Peticion peticion = peticionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Petición no encontrada: " + id));

        Miembro miembro = miembroRepository.findByCorreoMiembro(correoMiembro)
                .orElseThrow(() -> new ResourceNotFoundException("Miembro no encontrado"));

        if (!peticion.getMiembro().getId().equals(miembro.getId())) {
            throw new RuntimeException("No tienes permiso para editar esta petición");
        }

        if (req.getTipoPeticion() != null) peticion.setTipoPeticion(req.getTipoPeticion());
        if (req.getAsunto() != null) peticion.setAsunto(req.getAsunto());
        if (req.getDescripcion() != null) peticion.setDescripcion(req.getDescripcion());
        if (req.getUbicacion() != null) peticion.setUbicacion(req.getUbicacion());
        if (req.getFechaHecho() != null) peticion.setFechaHecho(req.getFechaHecho());
        if (req.getPersonaInvolucrada() != null) peticion.setPersonaInvolucrada(req.getPersonaInvolucrada());

        return peticionRepository.save(peticion);
    }

    public Peticion eliminarEvidencia(String peticionId, String publicId) {
        Peticion peticion = peticionRepository.findById(peticionId)
                .orElseThrow(() -> new ResourceNotFoundException("Petición no encontrada: " + peticionId));
        boolean removed = peticion.getEvidencias().removeIf(e -> publicId.equals(e.getPublicId()));
        if (!removed) {
            throw new ResourceNotFoundException("Evidencia no encontrada");
        }
        return peticionRepository.save(peticion);
    }

    public Peticion editarRespuesta(String peticionId, String respuestaId, String nuevoTexto) {
        Peticion peticion = peticionRepository.findById(peticionId)
                .orElseThrow(() -> new ResourceNotFoundException("Petición no encontrada: " + peticionId));

        com.pqrs.system_pqrs.document.embedded.RespuestaEmbedded respuesta = peticion.getRespuestas().stream()
                .filter(r -> respuestaId.equals(r.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Respuesta no encontrada: " + respuestaId));

        respuesta.setTexto(nuevoTexto);
        return peticionRepository.save(peticion);
    }

    public void deleteById(String id) {
        if (!peticionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Petición no encontrada: " + id);
        }
        peticionRepository.deleteById(id);
    }
}
