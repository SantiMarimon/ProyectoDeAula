package com.pqrs.system_pqrs.controller;

import com.pqrs.system_pqrs.document.Miembro;
import com.pqrs.system_pqrs.dto.CambiarRolRequest;
import com.pqrs.system_pqrs.dto.SuspenderRequest;
import com.pqrs.system_pqrs.service.MiembroService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/miembros")
@PreAuthorize("hasRole('ADMIN')")
public class MiembroController {

    private final MiembroService miembroService;

    public MiembroController(MiembroService miembroService) {
        this.miembroService = miembroService;
    }

    @GetMapping
    public List<Miembro> getAll() {
        return miembroService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Miembro> getById(@PathVariable String id) {
        return miembroService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Miembro> update(@PathVariable String id, @RequestBody Miembro details) {
        return miembroService.findById(id).map(miembro -> {
            if (details.getNombreMiembro() != null) miembro.setNombreMiembro(details.getNombreMiembro());
            if (details.getApellidoMiembro() != null) miembro.setApellidoMiembro(details.getApellidoMiembro());
            if (details.getTelMiembro() != null) miembro.setTelMiembro(details.getTelMiembro());
            if (details.getCorreoMiembro() != null) miembro.setCorreoMiembro(details.getCorreoMiembro());
            if (details.getDireccion() != null) miembro.setDireccion(details.getDireccion());
            return ResponseEntity.ok(miembroService.save(miembro));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<Miembro> cambiarRol(@PathVariable String id,
                                               @RequestBody CambiarRolRequest req) {
        return ResponseEntity.ok(miembroService.cambiarRol(id, req.getRol()));
    }

    @PutMapping("/{id}/suspender")
    public ResponseEntity<Miembro> suspender(@PathVariable String id,
                                              @RequestBody SuspenderRequest req) {
        return ResponseEntity.ok(miembroService.cambiarEstadoActivo(id, req.isActivo()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (miembroService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        miembroService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
