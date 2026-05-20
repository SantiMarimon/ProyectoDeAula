package com.pqrs.system_pqrs.service;

import com.pqrs.system_pqrs.document.Configuracion;
import com.pqrs.system_pqrs.repository.ConfiguracionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfiguracionService {

    private final ConfiguracionRepository configuracionRepository;

    public ConfiguracionService(ConfiguracionRepository configuracionRepository) {
        this.configuracionRepository = configuracionRepository;
    }

    public Configuracion getConfiguracion() {
        List<Configuracion> lista = configuracionRepository.findAll();
        if (lista.isEmpty()) {
            Configuracion cfg = new Configuracion();
            cfg.setNombreJac("JAC Barrio Policarpa");
            cfg.setDireccion("");
            cfg.setTelefono("");
            cfg.setMensajeBienvenida("Bienvenido al sistema PQRS de la JAC del Barrio Policarpa.");
            return configuracionRepository.save(cfg);
        }
        return lista.get(0);
    }

    public Configuracion actualizar(Configuracion nueva) {
        Configuracion cfg = getConfiguracion();
        if (nueva.getNombreJac() != null) cfg.setNombreJac(nueva.getNombreJac());
        if (nueva.getDireccion() != null) cfg.setDireccion(nueva.getDireccion());
        if (nueva.getTelefono() != null) cfg.setTelefono(nueva.getTelefono());
        if (nueva.getMensajeBienvenida() != null) cfg.setMensajeBienvenida(nueva.getMensajeBienvenida());
        return configuracionRepository.save(cfg);
    }
}
