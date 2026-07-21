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
        int damageDealt = hero.getAttack(); // Default awal: 25[cite: 21]
        
        int finalEnemyHp = baseEnemyHp - damageDealt;
        if (finalEnemyHp < 0) finalEnemyHp = 0;

        boolean isDead = (finalEnemyHp <= 0);
        String message = "Hero menyerang enemy";

        if (isDead) {
            // 1. Tambah EXP
            int currentExp = hero.getExperience() + 50;
            hero.setExperience(currentExp);

            // 2. Logika Sederhana Kenaikan Level (Setiap kelipatan 100 EXP = Naik Level)
            int calculatedLevel = (currentExp / 100) + 1;
            
            if (calculatedLevel > hero.getLevel()) {
                hero.setLevel(calculatedLevel);
                
                // Tingkatkan stats hero setiap naik level
                hero.setMaxHealth(hero.getMaxHealth() + 20); // Maks HP bertambah 20
                hero.setHealth(hero.getMaxHealth());         // HP langsung pulih penuh
                hero.setAttack(hero.getAttack() + 5);        // Serangan bertambah +5
                
                System.out.println("SELAMAT! " + hero.getName() + " MENCAPAI LEVEL " + calculatedLevel);
            }

            heroRepository.save(hero);
            message = "Enemy dikalahkan!";
        }

        // 🔥 PERBAIKAN: Gunakan constructor dengan 7 parameter yang sesuai dengan AttackResponse baru
        return new AttackResponse(
            message,
            damageDealt,
            finalEnemyHp,
            isDead,
            hero.getHealth(),
            hero.getExperience(),
            hero.getLevel()
        );
    }
}