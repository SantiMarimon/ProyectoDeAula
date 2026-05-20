package com.pqrs.system_pqrs.service;

import com.pqrs.system_pqrs.document.Miembro;
import com.pqrs.system_pqrs.document.enums.RolNombre;
import com.pqrs.system_pqrs.exception.ResourceNotFoundException;
import com.pqrs.system_pqrs.repository.MiembroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MiembroServiceImpl implements MiembroService {

    private final MiembroRepository miembroRepository;

    public MiembroServiceImpl(MiembroRepository miembroRepository) {
        this.miembroRepository = miembroRepository;
    }

    @Override
    public List<Miembro> findAll() {
        return miembroRepository.findAll();
    }

    @Override
    public Optional<Miembro> findById(String id) {
        return miembroRepository.findById(id);
    }

    @Override
    public Miembro save(Miembro miembro) {
        return miembroRepository.save(miembro);
    }

    @Override
    public void deleteById(String id) {
        miembroRepository.deleteById(id);
    }

    @Override
    public Optional<Miembro> findByCorreo(String correo) {
        return miembroRepository.findByCorreoMiembro(correo);
    }

    @Override
    public boolean existsByCorreo(String correo) {
        return miembroRepository.existsByCorreoMiembro(correo);
    }

    @Override
    public Miembro cambiarRol(String id, RolNombre nuevoRol) {
        Miembro miembro = miembroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Miembro no encontrado: " + id));
        miembro.setRol(nuevoRol);
        return miembroRepository.save(miembro);
    }

    @Override
    public Miembro cambiarEstadoActivo(String id, boolean activo) {
        Miembro miembro = miembroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Miembro no encontrado: " + id));
        miembro.setActivo(activo);
        return miembroRepository.save(miembro);
    }
}
