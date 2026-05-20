package com.pqrs.system_pqrs.dto;

public class RecuperarPasswordRequest {
    private String correo;
    private String nuevaPassword;

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getNuevaPassword() { return nuevaPassword; }
    public void setNuevaPassword(String nuevaPassword) { this.nuevaPassword = nuevaPassword; }
}
