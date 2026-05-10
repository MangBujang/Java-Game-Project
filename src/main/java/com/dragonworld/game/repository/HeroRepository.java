package com.dragonworld.game.repository;

import com.dragonworld.game.model.Hero;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeroRepository extends JpaRepository<Hero, Long> {
    
}
