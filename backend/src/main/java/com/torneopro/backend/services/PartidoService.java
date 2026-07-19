package com.torneopro.backend.services;

import com.torneopro.backend.models.Partido;

import java.util.List;

public interface PartidoService {
    List<Partido> generarPartidosTorneo(Long torneoId);
    List<Partido> getPartidosByTorneoId(Long torneoId);
}