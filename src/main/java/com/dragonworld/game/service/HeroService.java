package com.dragonworld.game.service;

import com.dragonworld.game.model.Hero;
import com.dragonworld.game.repository.HeroRepository;
import com.dragonworld.game.dto.AttackResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HeroService {

    @Autowired
    private HeroRepository heroRepository;

    public AttackResponse processHeroAttack(Long heroId, Long enemyId) {
        Hero hero = heroRepository.findById(heroId)
                .orElseThrow(() -> new RuntimeException("Hero tidak ditemukan"));

        int baseEnemyHp = 100; 
        int damageDealt = hero.getAttack(); // Default awal: 25
        
        int finalEnemyHp = baseEnemyHp - damageDealt;
        if (finalEnemyHp < 0) finalEnemyHp = 0;

        boolean isDead = (finalEnemyHp <= 0);

        if (isDead) {
            // 1. Tambah EXP
            int currentExp = hero.getExperience() + 50;
            hero.setExperience(currentExp);

            // 2. Logika Sederhana Kenaikan Level (Setiap kelipatan 100 EXP = Naik Level)
            int calculatedLevel = (currentExp / 100) + 1;
            
            if (calculatedLevel > hero.getLevel()) {
                hero.setLevel(calculatedLevel);
                
                // Tingkatkan stats hero setiap naik level[cite: 3]
                hero.setMaxHealth(hero.getMaxHealth() + 20); // Maks HP bertambah 20[cite: 3]
                hero.setHealth(hero.getMaxHealth());         // HP langsung pulih penuh[cite: 3]
                hero.setAttack(hero.getAttack() + 5);        // Serangan bertambah +5[cite: 3]
                
                System.out.println("SELAMAT! " + hero.getName() + " MENCAPAI LEVEL " + calculatedLevel);
            }

            heroRepository.save(hero);
        }

        return new AttackResponse(finalEnemyHp, isDead);
    }
}