package com.pqrs.system_pqrs.repository;

import com.pqrs.system_pqrs.document.Configuracion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ConfiguracionRepository extends MongoRepository<Configuracion, String> {
}
