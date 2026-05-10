package com.dragonworld.game.repository;

import com.dragonworld.game.model.Dragon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DragonRepository extends JpaRepository<Dragon, Long> {
    // Dengan meng-extends JpaRepository, 
    // Spring otomatis memberikan fungsi .save(), .findAll(), .count(), dll.
}