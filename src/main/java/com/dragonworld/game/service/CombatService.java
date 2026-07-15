package com.dragonworld.game.service;

import com.dragonworld.game.dto.AttackRequest;
import com.dragonworld.game.dto.AttackResponse;
import com.dragonworld.game.model.Enemy;
import com.dragonworld.game.model.Hero;
import com.dragonworld.game.repository.EnemyRepository;
import com.dragonworld.game.repository.HeroRepository;
import org.springframework.stereotype.Service;

@Service
public class CombatService {

    private final HeroRepository heroRepository;
    private final EnemyRepository enemyRepository;

    public CombatService(HeroRepository heroRepository, EnemyRepository enemyRepository) {
        this.heroRepository = heroRepository;
        this.enemyRepository = enemyRepository;
    }

    public AttackResponse heroAttack(AttackRequest request) {

        // VALIDASI
        if (request.getHeroId() == null || request.getEnemyId() == null) {
            throw new RuntimeException("heroId dan enemyId wajib diisi");
        }

        Hero hero = heroRepository.findById(request.getHeroId())
                .orElseThrow(() -> new RuntimeException("Hero tidak ditemukan"));

        Enemy enemy = enemyRepository.findById(request.getEnemyId())
                .orElseThrow(() -> new RuntimeException("Enemy tidak ditemukan"));

        if (enemy.isDead()) {
            return new AttackResponse(
                "Enemy sudah mati",
                0,
                enemy.getHealth(),
                true,
                hero.getHealth(),
                hero.getExperience(),
                hero.getLevel()
            );
        }

        // =========================
        // HERO ATTACK
        // =========================
        int damageDealt = Math.max(1, hero.getAttack());
        enemy.setHealth(enemy.getHealth() - damageDealt);

        String message = "Hero menyerang enemy";

        // =========================
        // ENEMY MATI
        // =========================
        if (enemy.getHealth() <= 0) {
            enemy.setHealth(0);
            enemy.setDead(true);

            int gainedXP = 50;
            int currentExp = hero.getExperience() + gainedXP;
            hero.setExperience(currentExp);

            // LEVEL SYSTEM
            int level = hero.getLevel();
            while (currentExp >= level * 100) {
                level++;
            }
            hero.setLevel(level);

            message = "Enemy dikalahkan!";
        }
        // =========================
        // ENEMY BALAS SERANG
        // =========================
        else {
            int enemyDamage = Math.max(1, enemy.getAttack() - hero.getDefense());
            hero.setHealth(hero.getHealth() - enemyDamage);

            if (hero.getHealth() <= 0) {
                hero.setHealth(0);
                message = "Hero mati!";
            } else {
                message = "Saling menyerang!";
            }
        }

        // SAVE
        heroRepository.save(hero);
        enemyRepository.save(enemy);

        return new AttackResponse(
            message,
            damageDealt,
            enemy.getHealth(),
            enemy.isDead(),
            hero.getHealth(),
            hero.getExperience(),
            hero.getLevel()
        );
    }
}