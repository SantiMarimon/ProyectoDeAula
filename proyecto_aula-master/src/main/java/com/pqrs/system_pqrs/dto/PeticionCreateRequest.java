package com.pqrs.system_pqrs.dto;

import com.pqrs.system_pqrs.document.enums.TipoPeticionEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PeticionCreateRequest {

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "El tipo de petición es obligatorio")
    private TipoPeticionEnum tipoPeticion;

    private String asunto;
    private String area;
    private String ubicacion;
    private String fechaHecho;
    private String personaInvolucrada;
    private String contactoNombre;
    private String contactoEmail;
    private String contactoTelefono;

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public TipoPeticionEnum getTipoPeticion() { return tipoPeticion; }
    public void setTipoPeticion(TipoPeticionEnum tipoPeticion) { this.tipoPeticion = tipoPeticion; }

    public String getAsunto() { return asunto; }
    public void setAsunto(String asunto) { this.asunto = asunto; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public String getFechaHecho() { return fechaHecho; }
    public void setFechaHecho(String fechaHecho) { this.fechaHecho = fechaHecho; }

    public String getPersonaInvolucrada() { return personaInvolucrada; }
    public void setPersonaInvolucrada(String personaInvolucrada) { this.personaInvolucrada = personaInvolucrada; }

    public String getContactoNombre() { return contactoNombre; }
    public void setContactoNombre(String contactoNombre) { this.contactoNombre = contactoNombre; }

    public String getContactoEmail() { return contactoEmail; }
    public void setContactoEmail(String contactoEmail) { this.contactoEmail = contactoEmail; }

    public String getContactoTelefono() { return contactoTelefono; }
    public void setContactoTelefono(String contactoTelefono) { this.contactoTelefono = contactoTelefono; }
}
