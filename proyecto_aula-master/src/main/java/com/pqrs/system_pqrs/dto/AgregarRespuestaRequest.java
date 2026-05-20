package com.pqrs.system_pqrs.dto;

import jakarta.validation.constraints.NotBlank;

public class AgregarRespuestaRequest {

    @NotBlank(message = "El texto de la respuesta es obligatorio")
    private String texto;

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
}
