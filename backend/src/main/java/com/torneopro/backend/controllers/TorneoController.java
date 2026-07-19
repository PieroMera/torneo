package com.torneopro.backend.controllers;

import com.torneopro.backend.models.Equipo;
import com.torneopro.backend.models.Partido;
import com.torneopro.backend.models.Torneo; // Import faltante
import com.torneopro.backend.services.EquipoService;
import com.torneopro.backend.services.PartidoService;
import com.torneopro.backend.services.TorneoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/torneos")
@CrossOrigin(origins = "*")
public class TorneoController {

    private final TorneoService torneoService;
    private final EquipoService equipoService;
    private final PartidoService partidoService;

    @Autowired
    public TorneoController(TorneoService torneoService, EquipoService equipoService, PartidoService partidoService) {
        this.torneoService = torneoService;
        this.equipoService = equipoService;
        this.partidoService = partidoService;
    }

    // GET: Obtener todos los torneos
    @GetMapping
    public ResponseEntity<List<Torneo>> getAllTorneos() {
        List<Torneo> torneos = torneoService.findAll();
        return ResponseEntity.ok(torneos);
    }

    // GET /api/torneos/{id} - Obtiene un torneo por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Torneo> getTorneoById(@PathVariable Long id) {
        return torneoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: Crear un nuevo torneo
    @PostMapping
    public ResponseEntity<Torneo> createTorneo(@RequestBody Torneo nuevoTorneo) {
        try {
            nuevoTorneo.setId(null);
            Torneo torneoGuardado = torneoService.createTorneo(nuevoTorneo);
            return new ResponseEntity<>(torneoGuardado, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/torneos/{id}/equipos - Devuelve la tabla de posiciones de un torneo
    @GetMapping("/{id}/equipos")
    public ResponseEntity<List<Equipo>> getTablaDePosiciones(@PathVariable Long id) {
        Optional<Torneo> torneo = torneoService.findById(id);
        if (torneo.isPresent()) {
            List<Equipo> equipos = torneoService.getTablaDePosiciones(id);
            return ResponseEntity.ok(equipos);
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/torneos/{id}/generar-partidos - Genera los partidos para el torneo
    @PostMapping("/{id}/generar-partidos")
    public ResponseEntity<List<Partido>> generarPartidos(@PathVariable Long id) {
        try {
            List<Partido> partidos = partidoService.generarPartidosTorneo(id);
            return ResponseEntity.ok(partidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/partidos")
    public ResponseEntity<List<Partido>> getPartidosDelTorneo(@PathVariable Long id) {
        return ResponseEntity.ok(partidoService.getPartidosByTorneoId(id));
    }
}
