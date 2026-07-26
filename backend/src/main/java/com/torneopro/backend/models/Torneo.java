package com.torneopro.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data // Lombok: genera getters, setters, toString, etc.
@NoArgsConstructor // Lombok: genera constructor vacío
@AllArgsConstructor // Lombok: genera constructor con todos los argumentos
@Builder
@Entity
@Table(name = "torneos")
public class Torneo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String type; // "Selecciones" o "Clubes"

    @Column(length = 50)
    private String status; // Ej: "Activo", "Inscripción"

    @Column(name = "creado_por", length = 170)
    private String creadoPor;

    @Transient
    private String creadorEmail;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "torneo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Equipo> equipos = new ArrayList<>();

    @OneToMany(mappedBy = "torneo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Partido> partidos = new ArrayList<>();

    // Se ejecuta automáticamente antes de insertar en la BD
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "Activo";
        }
        if (this.equipos == null) {
            this.equipos = new ArrayList<>();
        }
    }
}
