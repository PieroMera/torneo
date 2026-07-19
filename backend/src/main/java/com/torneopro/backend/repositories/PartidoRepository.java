package com.torneopro.backend.repositories;

import com.torneopro.backend.models.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {
    List<Partido> findByTorneoIdOrderByGrupo(Long torneoId);

    @Modifying
    @Query("DELETE FROM Partido p WHERE p.torneo.id = :torneoId")
    void deleteByTorneoId(Long torneoId);
}