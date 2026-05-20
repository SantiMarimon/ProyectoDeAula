package com.pqrs.system_pqrs.document.embedded;

import java.time.LocalDateTime;

public class EvidenciaEmbedded {
    private String nombreArchivo;
    private String url;
    private String publicId;
    private LocalDateTime fechaSubida;
    private String subidaPor; // "RESIDENTE" o "ADMIN"

    public EvidenciaEmbedded() {}

    public EvidenciaEmbedded(String nombreArchivo, String url, String publicId, LocalDateTime fechaSubida) {
        this.nombreArchivo = nombreArchivo;
        this.url = url;
        this.publicId = publicId;
        this.fechaSubida = fechaSubida;
    }

    public String getNombreArchivo() { return nombreArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getPublicId() { return publicId; }
    public void setPublicId(String publicId) { this.publicId = publicId; }

    public LocalDateTime getFechaSubida() { return fechaSubida; }
    public void setFechaSubida(LocalDateTime fechaSubida) { this.fechaSubida = fechaSubida; }

    public String getSubidaPor() { return subidaPor; }
    public void setSubidaPor(String subidaPor) { this.subidaPor = subidaPor; }
}
