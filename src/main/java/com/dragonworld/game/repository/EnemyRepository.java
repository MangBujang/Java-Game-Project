package com.dragonworld.game.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.dragonworld.game.model.Enemy;

@Repository
public interface EnemyRepository extends JpaRepository<Enemy, Long> {
}