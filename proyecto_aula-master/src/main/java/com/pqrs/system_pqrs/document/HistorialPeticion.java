package com.pqrs.system_pqrs.document;

import com.pqrs.system_pqrs.document.embedded.MiembroRef;
import com.pqrs.system_pqrs.document.enums.EstadoPeticion;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "historialpeticion")
public class HistorialPeticion {

    @Id
    private String id;

    @Indexed
    private String peticionId;

    private EstadoPeticion estado;
    private MiembroRef responsable;
    private LocalDateTime fecha;
    private String observacion;

    public HistorialPeticion() {}

    public HistorialPeticion(String peticionId, EstadoPeticion estado, MiembroRef responsable,
                              LocalDateTime fecha, String observacion) {
        this.peticionId = peticionId;
        this.estado = estado;
        this.responsable = responsable;
        this.fecha = fecha;
        this.observacion = observacion;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPeticionId() { return peticionId; }
    public void setPeticionId(String peticionId) { this.peticionId = peticionId; }

    public EstadoPeticion getEstado() { return estado; }
    public void setEstado(EstadoPeticion estado) { this.estado = estado; }

    public MiembroRef getResponsable() { return responsable; }
    public void setResponsable(MiembroRef responsable) { this.responsable = responsable; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
}
