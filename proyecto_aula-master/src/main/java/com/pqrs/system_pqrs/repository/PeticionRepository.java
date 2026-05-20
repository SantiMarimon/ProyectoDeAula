package com.pqrs.system_pqrs.repository;

import com.pqrs.system_pqrs.document.Peticion;
import com.pqrs.system_pqrs.document.enums.EstadoPeticion;
import com.pqrs.system_pqrs.document.enums.TipoPeticionEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PeticionRepository extends MongoRepository<Peticion, String> {

    @Query("{'miembro.id': ?0}")
    List<Peticion> findByMiembroId(String miembroId);

    @Query("{'responsable.id': ?0}")
    List<Peticion> findByResponsableId(String responsableId);

    List<Peticion> findByEstado(EstadoPeticion estado);

    List<Peticion> findByTipoPeticion(TipoPeticionEnum tipoPeticion);

    Page<Peticion> findAll(Pageable pageable);

    Page<Peticion> findByEstado(EstadoPeticion estado, Pageable pageable);

    @Query("{'miembro.id': ?0}")
    Page<Peticion> findByMiembroId(String miembroId, Pageable pageable);
}
