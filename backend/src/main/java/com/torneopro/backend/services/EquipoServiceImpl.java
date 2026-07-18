package com.torneopro.backend.services;

import com.torneopro.backend.dtos.ResultadoPartidoDTO;
import com.torneopro.backend.models.Equipo;
import com.torneopro.backend.models.Torneo;
import com.torneopro.backend.repositories.EquipoRepository;
import com.torneopro.backend.repositories.TorneoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EquipoServiceImpl implements EquipoService {

    private static final int EQUIPOS_POR_GRUPO = 4;

    private final EquipoRepository equipoRepository;
    private final TorneoRepository torneoRepository;

    public EquipoServiceImpl(EquipoRepository equipoRepository, TorneoRepository torneoRepository) {
        this.equipoRepository = equipoRepository;
        this.torneoRepository = torneoRepository;
    }

    @Override
    @Transactional
    public Equipo addEquipoToTorneo(Long torneoId, Equipo equipo) {
        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new EntityNotFoundException("Torneo no encontrado con id: " + torneoId));

        equipo.setTorneo(torneo);
        equipo.setGrupo(asignarGrupo(torneoId));
        return equipoRepository.save(equipo);
    }

    private String asignarGrupo(Long torneoId) {
        List<Equipo> equiposDelTorneo = equipoRepository.findByTorneoId(torneoId);
        Map<String, Long> equiposPorGrupo = equiposDelTorneo.stream()
                .filter(e -> e.getGrupo() != null)
                .collect(Collectors.groupingBy(Equipo::getGrupo, Collectors.counting()));

        int indiceGrupo = 0;
        while (true) {
            String letra = String.valueOf((char) ('A' + indiceGrupo));
            long ocupados = equiposPorGrupo.getOrDefault(letra, 0L);
            if (ocupados < EQUIPOS_POR_GRUPO) {
                return letra;
            }
            indiceGrupo++;
        }
    }

    @Override
    @Transactional
    public void registrarResultadoPartido(ResultadoPartidoDTO resultado) {
        Equipo local = equipoRepository.findById(resultado.getEquipoLocalId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Equipo local no encontrado con id: " + resultado.getEquipoLocalId()));

        Equipo visitante = equipoRepository.findById(resultado.getEquipoVisitanteId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Equipo visitante no encontrado con id: " + resultado.getEquipoVisitanteId()));

        int golesLocal = resultado.getGolesLocal();
        int golesVisitante = resultado.getGolesVisitante();

        local.setGf(local.getGf() + golesLocal);
        local.setGc(local.getGc() + golesVisitante);
        local.setDf(local.getGf() - local.getGc());

        visitante.setGf(visitante.getGf() + golesVisitante);
        visitante.setGc(visitante.getGc() + golesLocal);
        visitante.setDf(visitante.getGf() - visitante.getGc());

        if (golesLocal > golesVisitante) {
            local.setPts(local.getPts() + 3);
            local.setV(local.getV() + 1);
            visitante.setD(visitante.getD() + 1);
        } else if (golesVisitante > golesLocal) {
            visitante.setPts(visitante.getPts() + 3);
            visitante.setV(visitante.getV() + 1);
            local.setD(local.getD() + 1);
        } else {
            local.setPts(local.getPts() + 1);
            local.setE(local.getE() + 1);
            visitante.setPts(visitante.getPts() + 1);
            visitante.setE(visitante.getE() + 1);
        }

        // Guardados en la misma transacción: si falla uno, se revierte el otro
        equipoRepository.save(local);
        equipoRepository.save(visitante);
    }
}
