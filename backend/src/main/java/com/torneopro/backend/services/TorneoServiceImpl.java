package com.torneopro.backend.services;

import com.torneopro.backend.models.Equipo;
import com.torneopro.backend.models.Torneo;
import com.torneopro.backend.repositories.EquipoRepository;
import com.torneopro.backend.repositories.PartidoRepository;
import com.torneopro.backend.repositories.TorneoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TorneoServiceImpl implements TorneoService {

    private final TorneoRepository torneoRepository;
    private final EquipoRepository equipoRepository;
    private final PartidoRepository partidoRepository;

    public TorneoServiceImpl(TorneoRepository torneoRepository, EquipoRepository equipoRepository, PartidoRepository partidoRepository) {
        this.torneoRepository = torneoRepository;
        this.equipoRepository = equipoRepository;
        this.partidoRepository = partidoRepository;
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

    @Override
    @Transactional
    public void deleteTorneo(Long id) {
        if (!torneoRepository.existsById(id)) {
            throw new EntityNotFoundException("Torneo no encontrado con id: " + id);
        }
        partidoRepository.deleteByTorneoId(id);
        torneoRepository.deleteById(id);
    }
}
