package com.pqrs.system_pqrs.repository;

import com.pqrs.system_pqrs.document.Miembro;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MiembroRepository extends MongoRepository<Miembro, String> {
    Optional<Miembro> findByCorreoMiembro(String correoMiembro);
    boolean existsByCorreoMiembro(String correoMiembro);
}
