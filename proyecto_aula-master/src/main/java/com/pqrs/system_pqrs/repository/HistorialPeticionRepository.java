package com.pqrs.system_pqrs.repository;

import com.pqrs.system_pqrs.document.HistorialPeticion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HistorialPeticionRepository extends MongoRepository<HistorialPeticion, String> {
    List<HistorialPeticion> findByPeticionIdOrderByFechaAsc(String peticionId);
}
