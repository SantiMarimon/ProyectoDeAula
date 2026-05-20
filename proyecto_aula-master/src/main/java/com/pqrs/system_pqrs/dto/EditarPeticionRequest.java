package com.pqrs.system_pqrs.dto;

import com.pqrs.system_pqrs.document.enums.TipoPeticionEnum;

public class EditarPeticionRequest {

    private TipoPeticionEnum tipoPeticion;
    private String asunto;
    private String descripcion;
    private String ubicacion;
    private String fechaHecho;
    private String personaInvolucrada;

    public TipoPeticionEnum getTipoPeticion() { return tipoPeticion; }
    public void setTipoPeticion(TipoPeticionEnum tipoPeticion) { this.tipoPeticion = tipoPeticion; }

    public String getAsunto() { return asunto; }
    public void setAsunto(String asunto) { this.asunto = asunto; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public String getFechaHecho() { return fechaHecho; }
    public void setFechaHecho(String fechaHecho) { this.fechaHecho = fechaHecho; }

    public String getPersonaInvolucrada() { return personaInvolucrada; }
    public void setPersonaInvolucrada(String personaInvolucrada) { this.personaInvolucrada = personaInvolucrada; }
}
