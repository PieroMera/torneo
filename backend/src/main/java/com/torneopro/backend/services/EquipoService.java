package com.torneopro.backend.services;

import com.torneopro.backend.dtos.ResultadoPartidoDTO;
import com.torneopro.backend.models.Equipo;

public interface EquipoService {
    Equipo addEquipoToTorneo(Long torneoId, Equipo equipo);
    void registrarResultadoPartido(ResultadoPartidoDTO resultado);
}
