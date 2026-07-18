package com.torneopro.backend.repositories;

import com.torneopro.backend.models.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    List<Equipo> findByTorneoId(Long torneoId);

    @Query("SELECT e FROM Equipo e WHERE e.torneo.id = :torneoId ORDER BY e.pts DESC, e.df DESC, e.gf DESC")
    List<Equipo> findByTorneoIdOrderByStandings(Long torneoId);
}
