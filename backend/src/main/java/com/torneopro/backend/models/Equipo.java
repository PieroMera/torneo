package com.torneopro.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "equipos")
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private int pts = 0; // Puntos

    @Column(nullable = false)
    private int v = 0; // Victorias

    @Column(nullable = false)
    private int e = 0; // Empates

    @Column(nullable = false)
    private int d = 0; // Derrotas

    @Column(nullable = false)
    private int gf = 0; // Goles a favor

    @Column(nullable = false)
    private int gc = 0; // Goles en contra

    @Column(nullable = false)
    private int df = 0; // Diferencia de goles

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "torneo_id", nullable = false)
    @JsonIgnore
    private Torneo torneo;

    @Column(name = "grupo", length = 20)
    private String grupo;
}