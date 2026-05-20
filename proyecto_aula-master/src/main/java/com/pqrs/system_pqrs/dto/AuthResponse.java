package com.pqrs.system_pqrs.dto;

public class AuthResponse {
    private String token;
    private String correo;
    private String rol;
    private String nombre;
    private String miembroId;

    public AuthResponse(String token, String correo, String rol, String nombre, String miembroId) {
        this.token = token;
        this.correo = correo;
        this.rol = rol;
        this.nombre = nombre;
        this.miembroId = miembroId;
    }

    public String getToken() { return token; }
    public String getCorreo() { return correo; }
    public String getRol() { return rol; }
    public String getNombre() { return nombre; }
    public String getMiembroId() { return miembroId; }
}
