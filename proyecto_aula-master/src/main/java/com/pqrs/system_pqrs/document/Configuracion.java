package com.pqrs.system_pqrs.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "configuracion")
public class Configuracion {

    @Id
    private String id;

    private String nombreJac;
    private String direccion;
    private String telefono;
    private String mensajeBienvenida;

    public Configuracion() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombreJac() { return nombreJac; }
    public void setNombreJac(String nombreJac) { this.nombreJac = nombreJac; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getMensajeBienvenida() { return mensajeBienvenida; }
    public void setMensajeBienvenida(String mensajeBienvenida) { this.mensajeBienvenida = mensajeBienvenida; }
}
