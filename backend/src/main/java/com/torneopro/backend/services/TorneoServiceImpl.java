package com.torneopro.backend.services;

import com.torneopro.backend.models.Equipo;
import com.torneopro.backend.models.Torneo;
import com.torneopro.backend.repositories.EquipoRepository;
import com.torneopro.backend.repositories.TorneoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TorneoServiceImpl implements TorneoService {

    private final TorneoRepository torneoRepository;
    private final EquipoRepository equipoRepository;

    public TorneoServiceImpl(TorneoRepository torneoRepository, EquipoRepository equipoRepository) {
        this.torneoRepository = torneoRepository;
        this.equipoRepository = equipoRepository;
    }

    @Override
    public List<Torneo> findAll() {
        return torneoRepository.findAll();
    }

    @Override
    public Optional<Torneo> findById(Long id) {
        return torneoRepository.findById(id);
    }

    @Override
    public Torneo createTorneo(Torneo torneo) {
        return torneoRepository.save(torneo);
    }

    @Override
    public List<Equipo> getTablaDePosiciones(Long torneoId) {
        if (!torneoRepository.existsById(torneoId)) {
            throw new EntityNotFoundException("Torneo no encontrado con id: " + torneoId);
        }
        return equipoRepository.findByTorneoIdOrderByStandings(torneoId);
    }
}
