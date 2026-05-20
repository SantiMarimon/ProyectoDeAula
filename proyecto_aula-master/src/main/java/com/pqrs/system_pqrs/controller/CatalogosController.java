package com.pqrs.system_pqrs.controller;

import com.pqrs.system_pqrs.document.enums.EstadoPeticion;
import com.pqrs.system_pqrs.document.enums.RolNombre;
import com.pqrs.system_pqrs.document.enums.TipoPeticionEnum;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/catalogos")
public class CatalogosController {

    @GetMapping("/estados")
    public List<String> getEstados() {
        return Arrays.stream(EstadoPeticion.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @GetMapping("/roles")
    public List<String> getRoles() {
        return Arrays.stream(RolNombre.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @GetMapping("/tipos-peticion")
    public List<Map<String, Object>> getTiposPeticion() {
        return Arrays.stream(TipoPeticionEnum.values())
                .map(t -> Map.of("nombre", (Object) t.name(), "tiempoDias", t.getTiempoDias()))
                .collect(Collectors.toList());
    }
}
