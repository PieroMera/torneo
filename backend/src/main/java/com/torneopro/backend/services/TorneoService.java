package com.torneopro.backend.services;

import java.util.List;
import java.util.Optional;

import com.torneopro.backend.models.Equipo;
import com.torneopro.backend.models.Torneo;

public interface TorneoService {
    List<Torneo> findAll();
    Optional<Torneo> findById(Long id);
    Torneo createTorneo(Torneo torneo);
    List<Equipo> getTablaDePosiciones(Long torneoId);
}
