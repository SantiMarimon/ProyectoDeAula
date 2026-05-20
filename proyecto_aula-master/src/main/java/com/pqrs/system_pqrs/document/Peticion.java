package com.pqrs.system_pqrs.document;

import com.pqrs.system_pqrs.document.embedded.EvidenciaEmbedded;
import com.pqrs.system_pqrs.document.embedded.MiembroRef;
import com.pqrs.system_pqrs.document.embedded.RespuestaEmbedded;
import com.pqrs.system_pqrs.document.enums.EstadoPeticion;
import com.pqrs.system_pqrs.document.enums.TipoPeticionEnum;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "peticiones")
public class Peticion {

    @Id
    private String id;

    private String descripcion;
    private String asunto;
    private String area;
    private String ubicacion;
    private String fechaHecho;
    private String personaInvolucrada;
    private String contactoNombre;
    private String contactoEmail;
    private String contactoTelefono;
    private String fechaEstimadaResolucion;

    private LocalDateTime fechaCreacion;

    private EstadoPeticion estado;
    private TipoPeticionEnum tipoPeticion;

    private MiembroRef miembro;
    private MiembroRef responsable;

    private List<RespuestaEmbedded> respuestas = new ArrayList<>();
    private List<EvidenciaEmbedded> evidencias = new ArrayList<>();

    public Peticion() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

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

    public String getFechaEstimadaResolucion() { return fechaEstimadaResolucion; }
    public void setFechaEstimadaResolucion(String fechaEstimadaResolucion) { this.fechaEstimadaResolucion = fechaEstimadaResolucion; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public EstadoPeticion getEstado() { return estado; }
    public void setEstado(EstadoPeticion estado) { this.estado = estado; }

    public TipoPeticionEnum getTipoPeticion() { return tipoPeticion; }
    public void setTipoPeticion(TipoPeticionEnum tipoPeticion) { this.tipoPeticion = tipoPeticion; }

    public MiembroRef getMiembro() { return miembro; }
    public void setMiembro(MiembroRef miembro) { this.miembro = miembro; }

    public MiembroRef getResponsable() { return responsable; }
    public void setResponsable(MiembroRef responsable) { this.responsable = responsable; }

    public List<RespuestaEmbedded> getRespuestas() { return respuestas; }
    public void setRespuestas(List<RespuestaEmbedded> respuestas) { this.respuestas = respuestas; }

    public List<EvidenciaEmbedded> getEvidencias() { return evidencias; }
    public void setEvidencias(List<EvidenciaEmbedded> evidencias) { this.evidencias = evidencias; }
}
