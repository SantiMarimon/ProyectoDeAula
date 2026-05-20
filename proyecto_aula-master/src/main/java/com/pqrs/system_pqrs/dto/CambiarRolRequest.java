package com.pqrs.system_pqrs.dto;

import com.pqrs.system_pqrs.document.enums.RolNombre;

public class CambiarRolRequest {

    private RolNombre rol;

    public RolNombre getRol() { return rol; }
    public void setRol(RolNombre rol) { this.rol = rol; }
}
