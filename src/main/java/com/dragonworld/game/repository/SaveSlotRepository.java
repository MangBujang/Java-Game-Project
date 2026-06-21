package com.dragonworld.game.repository;

import com.dragonworld.game.model.SaveSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SaveSlotRepository extends JpaRepository<SaveSlot, Long> {
    
}
