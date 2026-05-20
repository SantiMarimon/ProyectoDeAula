package com.pqrs.system_pqrs.document;

import com.pqrs.system_pqrs.document.enums.RolNombre;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "miembro")
public class Miembro {

    @Id
    private String id;

    private String nombreMiembro;
    private String apellidoMiembro;
    private String telMiembro;

    @Indexed(unique = true)
    private String correoMiembro;

    private String passwordMiembro;

    private RolNombre rol;
    private String direccion;
    private String codeMiembro;
    private String fotoPerfil;
    private boolean activo = true;
    private boolean notificaMudanza = false;

    public Miembro() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombreMiembro() { return nombreMiembro; }
    public void setNombreMiembro(String nombreMiembro) { this.nombreMiembro = nombreMiembro; }

    public String getApellidoMiembro() { return apellidoMiembro; }
    public void setApellidoMiembro(String apellidoMiembro) { this.apellidoMiembro = apellidoMiembro; }

    public String getTelMiembro() { return telMiembro; }
    public void setTelMiembro(String telMiembro) { this.telMiembro = telMiembro; }

    public String getCorreoMiembro() { return correoMiembro; }
    public void setCorreoMiembro(String correoMiembro) { this.correoMiembro = correoMiembro; }

    public String getPasswordMiembro() { return passwordMiembro; }
    public void setPasswordMiembro(String passwordMiembro) { this.passwordMiembro = passwordMiembro; }

    public RolNombre getRol() { return rol; }
    public void setRol(RolNombre rol) { this.rol = rol; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getCodeMiembro() { return codeMiembro; }
    public void setCodeMiembro(String codeMiembro) { this.codeMiembro = codeMiembro; }

    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public boolean isNotificaMudanza() { return notificaMudanza; }
    public void setNotificaMudanza(boolean notificaMudanza) { this.notificaMudanza = notificaMudanza; }

    public String getNombreCompleto() {
        return nombreMiembro + " " + apellidoMiembro;
    }
}
