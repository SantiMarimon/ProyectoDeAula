package com.pqrs.system_pqrs.service;

import com.pqrs.system_pqrs.document.Miembro;
import com.pqrs.system_pqrs.document.enums.RolNombre;
import com.pqrs.system_pqrs.dto.AuthResponse;
import com.pqrs.system_pqrs.dto.LoginRequest;
import com.pqrs.system_pqrs.dto.RegistroRequest;
import com.pqrs.system_pqrs.repository.MiembroRepository;
import com.pqrs.system_pqrs.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final MiembroRepository miembroRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(MiembroRepository miembroRepository, JwtService jwtService,
                       PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.miembroRepository = miembroRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getCorreo(), req.getPassword()));

        Miembro miembro = miembroRepository.findByCorreoMiembro(req.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtService.generateToken(miembro.getCorreoMiembro(), miembro.getRol().name());
        return new AuthResponse(token, miembro.getCorreoMiembro(),
                miembro.getRol().name(), miembro.getNombreCompleto(), miembro.getId());
    }

    public AuthResponse registro(RegistroRequest req) {
        if (miembroRepository.existsByCorreoMiembro(req.getCorreoMiembro())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        Miembro miembro = new Miembro();
        miembro.setNombreMiembro(req.getNombreMiembro());
        miembro.setApellidoMiembro(req.getApellidoMiembro());
        miembro.setTelMiembro(req.getTelMiembro());
        miembro.setCorreoMiembro(req.getCorreoMiembro());
        miembro.setPasswordMiembro(passwordEncoder.encode(req.getPassword()));
        miembro.setRol(RolNombre.RESIDENTE);

        Miembro saved = miembroRepository.save(miembro);
        String token = jwtService.generateToken(saved.getCorreoMiembro(), saved.getRol().name());
        return new AuthResponse(token, saved.getCorreoMiembro(),
                saved.getRol().name(), saved.getNombreCompleto(), saved.getId());
    }

    public void cambiarPassword(String correo, String nuevaPassword) {
        Miembro miembro = miembroRepository.findByCorreoMiembro(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        miembro.setPasswordMiembro(passwordEncoder.encode(nuevaPassword));
        miembroRepository.save(miembro);
    }

    public void eliminarCuenta(String correo) {
        Miembro miembro = miembroRepository.findByCorreoMiembro(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        miembroRepository.delete(miembro);
    }

    public java.util.Optional<Miembro> findByCorreo(String correo) {
        return miembroRepository.findByCorreoMiembro(correo);
    }

    public Miembro actualizarPerfil(String correo, Miembro details) {
        Miembro miembro = miembroRepository.findByCorreoMiembro(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (details.getNombreMiembro() != null) miembro.setNombreMiembro(details.getNombreMiembro());
        if (details.getApellidoMiembro() != null) miembro.setApellidoMiembro(details.getApellidoMiembro());
        if (details.getTelMiembro() != null) miembro.setTelMiembro(details.getTelMiembro());
        if (details.getDireccion() != null) miembro.setDireccion(details.getDireccion());
        return miembroRepository.save(miembro);
    }
}
