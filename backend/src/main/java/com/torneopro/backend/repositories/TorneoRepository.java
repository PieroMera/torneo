package com.torneopro.backend.repositories;

import com.torneopro.backend.models.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TorneoRepository extends JpaRepository<Torneo, Long> {
    // Si más adelante necesitas buscar por nombre, por ejemplo, puedes agregar:
    // List<Torneo> findByNameContainingIgnoreCase(String name);
}