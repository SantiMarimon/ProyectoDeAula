package com.pqrs.system_pqrs.controller;

import com.pqrs.system_pqrs.document.Miembro;
import com.pqrs.system_pqrs.dto.AuthResponse;
import com.pqrs.system_pqrs.dto.CambiarPasswordRequest;
import com.pqrs.system_pqrs.dto.LoginRequest;
import com.pqrs.system_pqrs.dto.RecuperarPasswordRequest;
import com.pqrs.system_pqrs.dto.RegistroRequest;
import com.pqrs.system_pqrs.exception.ResourceNotFoundException;
import com.pqrs.system_pqrs.repository.MiembroRepository;
import com.pqrs.system_pqrs.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final MiembroRepository miembroRepository;

    public AuthController(AuthService authService, MiembroRepository miembroRepository) {
        this.authService = authService;
        this.miembroRepository = miembroRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registro(@Valid @RequestBody RegistroRequest req) {
        return ResponseEntity.ok(authService.registro(req));
    }

    @GetMapping("/mi-perfil")
    public ResponseEntity<Miembro> miPerfil(Authentication auth) {
        return authService.findByCorreo(auth.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/mi-perfil")
    public ResponseEntity<Miembro> actualizarMiPerfil(@RequestBody Miembro details,
                                                        Authentication auth) {
        return ResponseEntity.ok(authService.actualizarPerfil(auth.getName(), details));
    }

    @PutMapping("/cambiar-password")
    public ResponseEntity<Void> cambiarPassword(@RequestBody CambiarPasswordRequest req,
                                                 Authentication auth) {
        authService.cambiarPassword(auth.getName(), req.getNuevaPassword());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/mi-cuenta")
    public ResponseEntity<Void> eliminarMiCuenta(Authentication auth) {
        authService.eliminarCuenta(auth.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/notificar-mudanza")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> notificarMudanza(Authentication auth) {
        Miembro miembro = miembroRepository.findByCorreoMiembro(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Miembro no encontrado"));
        miembro.setNotificaMudanza(true);
        miembroRepository.save(miembro);
        return ResponseEntity.ok(Map.of("mensaje", "Notificación de mudanza registrada correctamente."));
    }

    @PostMapping("/recuperar-password")
    public ResponseEntity<?> recuperarPassword(@RequestBody RecuperarPasswordRequest req) {
        if (authService.findByCorreo(req.getCorreo()).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Correo no registrado"));
        }
        authService.cambiarPassword(req.getCorreo(), req.getNuevaPassword());
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada"));
    }
}
