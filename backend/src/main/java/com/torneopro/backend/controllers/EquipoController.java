package com.torneopro.backend.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.torneopro.backend.dtos.ResultadoPartidoDTO;
import com.torneopro.backend.models.Equipo;
import com.torneopro.backend.services.EquipoService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    // POST /api/torneos/{id}/equipos - Añade un nuevo equipo a un torneo
    @PostMapping("/torneos/{torneoId}/equipos")
    public ResponseEntity<Equipo> addEquipo(@PathVariable Long torneoId, @RequestBody Equipo nuevoEquipo) {
        try {
            nuevoEquipo.setId(null);
            Equipo equipoGuardado = equipoService.addEquipoToTorneo(torneoId, nuevoEquipo);
            return new ResponseEntity<>(equipoGuardado, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /api/partidos/resultado - Registra el resultado de un partido
    @PostMapping("/partidos/resultado")
    public ResponseEntity<String> registrarResultado(@RequestBody ResultadoPartidoDTO resultado) {
        try {
            equipoService.registrarResultadoPartido(resultado);
            return ResponseEntity.ok("Resultado registrado exitosamente.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar el resultado.");
        }
    }
}