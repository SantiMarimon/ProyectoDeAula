package com.pqrs.system_pqrs.controller;

import com.pqrs.system_pqrs.document.Configuracion;
import com.pqrs.system_pqrs.service.ConfiguracionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionController {

    private final ConfiguracionService configuracionService;

    public ConfiguracionController(ConfiguracionService configuracionService) {
        this.configuracionService = configuracionService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Configuracion> get() {
        return ResponseEntity.ok(configuracionService.getConfiguracion());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Configuracion> update(@RequestBody Configuracion nueva) {
        return ResponseEntity.ok(configuracionService.actualizar(nueva));
    }
}
