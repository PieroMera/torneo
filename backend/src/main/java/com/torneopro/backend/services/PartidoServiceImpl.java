package com.torneopro.backend.services;

import com.torneopro.backend.models.Equipo;
import com.torneopro.backend.models.Partido;
import com.torneopro.backend.models.Torneo;
import com.torneopro.backend.repositories.EquipoRepository;
import com.torneopro.backend.repositories.PartidoRepository;
import com.torneopro.backend.repositories.TorneoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PartidoServiceImpl implements PartidoService {

    private final PartidoRepository partidoRepository;
    private final EquipoRepository equipoRepository;
    private final TorneoRepository torneoRepository;
    private static final int EQUIPOS_POR_GRUPO = 4;

    public PartidoServiceImpl(PartidoRepository partidoRepository, EquipoRepository equipoRepository, TorneoRepository torneoRepository) {
        this.partidoRepository = partidoRepository;
        this.equipoRepository = equipoRepository;
        this.torneoRepository = torneoRepository;
    }

    @Override
    @Transactional
    public List<Partido> generarPartidosTorneo(Long torneoId) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new EntityNotFoundException("Torneo no encontrado"));

        List<Equipo> equipos = equipoRepository.findByTorneoId(torneoId);
        Map<String, List<Equipo>> equiposPorGrupo = equipos.stream()
                .collect(Collectors.groupingBy(Equipo::getGrupo));

        List<Partido> partidosGenerados = new ArrayList<>();

        for (Map.Entry<String, List<Equipo>> entry : equiposPorGrupo.entrySet()) {
            if (entry.getValue().size() == EQUIPOS_POR_GRUPO) {
                List<Equipo> equiposDelGrupo = entry.getValue();
                for (int i = 0; i < equiposDelGrupo.size(); i++) {
                    for (int j = 0; j < equiposDelGrupo.size(); j++) {
                        if (i == j) continue;

                        Equipo local = equiposDelGrupo.get(i);
                        Equipo visitante = equiposDelGrupo.get(j);

                        Partido partido = new Partido();
                        partido.setTorneo(torneo);
                        partido.setCreadoPor(torneo.getCreadoPor());
                        partido.setGrupo(entry.getKey());
                        partido.setEquipoLocal(local);
                        partido.setEquipoVisitante(visitante);
                        partido.setStatus(Partido.StatusPartido.PENDIENTE);
                        partidosGenerados.add(partido);
                    }
                }
            }
        }

        Collections.shuffle(partidosGenerados);
        torneo.setStatus("En curso");
        torneoRepository.save(torneo);
        return partidoRepository.saveAll(partidosGenerados);
    }

    @Override
    public List<Partido> getPartidosByTorneoId(Long torneoId) {
        return partidoRepository.findByTorneoIdOrderByGrupo(torneoId);
    }
}
