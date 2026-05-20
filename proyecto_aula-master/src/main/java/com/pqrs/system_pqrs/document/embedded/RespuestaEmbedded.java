package com.pqrs.system_pqrs.document.embedded;

import java.time.LocalDateTime;

public class RespuestaEmbedded {
    private String id;
    private String miembroId;
    private String miembroNombre;
    private String texto;
    private LocalDateTime fecha;

    public RespuestaEmbedded() {}

    public RespuestaEmbedded(String miembroId, String miembroNombre, String texto, LocalDateTime fecha) {
        this.id = java.util.UUID.randomUUID().toString();
        this.miembroId = miembroId;
        this.miembroNombre = miembroNombre;
        this.texto = texto;
        this.fecha = fecha;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMiembroId() { return miembroId; }
    public void setMiembroId(String miembroId) { this.miembroId = miembroId; }

    public String getMiembroNombre() { return miembroNombre; }
    public void setMiembroNombre(String miembroNombre) { this.miembroNombre = miembroNombre; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}
