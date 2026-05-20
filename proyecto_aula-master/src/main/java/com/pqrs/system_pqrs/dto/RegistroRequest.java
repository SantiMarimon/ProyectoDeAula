package com.pqrs.system_pqrs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegistroRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombreMiembro;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellidoMiembro;

    private String telMiembro;

    @Email(message = "Correo inválido")
    @NotBlank(message = "El correo es obligatorio")
    private String correoMiembro;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    public String getNombreMiembro() { return nombreMiembro; }
    public void setNombreMiembro(String nombreMiembro) { this.nombreMiembro = nombreMiembro; }

    public String getApellidoMiembro() { return apellidoMiembro; }
    public void setApellidoMiembro(String apellidoMiembro) { this.apellidoMiembro = apellidoMiembro; }

    public String getTelMiembro() { return telMiembro; }
    public void setTelMiembro(String telMiembro) { this.telMiembro = telMiembro; }

    public String getCorreoMiembro() { return correoMiembro; }
    public void setCorreoMiembro(String correoMiembro) { this.correoMiembro = correoMiembro; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
