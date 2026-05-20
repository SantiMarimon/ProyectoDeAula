package com.pqrs.system_pqrs.service;

import com.pqrs.system_pqrs.document.HistorialPeticion;
import com.pqrs.system_pqrs.document.embedded.MiembroRef;
import com.pqrs.system_pqrs.document.enums.EstadoPeticion;
import com.pqrs.system_pqrs.repository.HistorialPeticionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HistorialPeticionService {

    private final HistorialPeticionRepository historialRepository;

    public HistorialPeticionService(HistorialPeticionRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    public List<HistorialPeticion> findByPeticionId(String peticionId) {
        return historialRepository.findByPeticionIdOrderByFechaAsc(peticionId);
    }

    public HistorialPeticion registrarEvento(String peticionId, EstadoPeticion estado,
                                              MiembroRef responsable, String observacion) {
        HistorialPeticion evento = new HistorialPeticion(
                peticionId, estado, responsable, LocalDateTime.now(), observacion);
        return historialRepository.save(evento);
    }
}
