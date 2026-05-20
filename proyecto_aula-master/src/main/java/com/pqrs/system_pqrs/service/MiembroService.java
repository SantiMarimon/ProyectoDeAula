package com.pqrs.system_pqrs.service;

import com.pqrs.system_pqrs.document.Miembro;
import com.pqrs.system_pqrs.document.enums.RolNombre;

import java.util.List;
import java.util.Optional;

public interface MiembroService {
    List<Miembro> findAll();
    Optional<Miembro> findById(String id);
    Miembro save(Miembro miembro);
    void deleteById(String id);
    Optional<Miembro> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
    Miembro cambiarRol(String id, RolNombre nuevoRol);
    Miembro cambiarEstadoActivo(String id, boolean activo);
}
