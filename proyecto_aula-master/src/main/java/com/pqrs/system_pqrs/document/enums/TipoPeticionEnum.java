package com.pqrs.system_pqrs.document.enums;

public enum TipoPeticionEnum {
    PETICION(30),
    QUEJA(15),
    RECLAMO(15),
    SUGERENCIA(30);

    private final int tiempoDias;

    TipoPeticionEnum(int tiempoDias) {
        this.tiempoDias = tiempoDias;
    }

    public int getTiempoDias() {
        return tiempoDias;
    }
}
