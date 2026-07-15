package com.dragonworld.game.config;

import com.dragonworld.game.model.Dragon;
import com.dragonworld.game.model.ElementType;
import com.dragonworld.game.model.Enemy;
import com.dragonworld.game.model.Hero;
import com.dragonworld.game.repository.DragonRepository;
import com.dragonworld.game.repository.HeroRepository;
import com.dragonworld.game.repository.EnemyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DragonRepository dragonRepository;
    private final HeroRepository heroRepository;
    private final EnemyRepository enemyRepository;

    // SATU Constructor untuk SEMUA repository
    public DataInitializer(DragonRepository dragonRepository, 
        HeroRepository heroRepository, 
        EnemyRepository enemyRepository) {
        this.dragonRepository = dragonRepository;
        this.heroRepository = heroRepository;
        this.enemyRepository = enemyRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // 1. Inisialisasi Naga Liar
        if (dragonRepository.count() == 0) {
            saveDragon("Monstrous Nightmare", ElementType.FIRE, 45, 25);
            saveDragon("Bewilderbeast", ElementType.WATER, 35, 50);
            saveDragon("Gronckle", ElementType.EARTH, 30, 40);
            saveDragon("Deadly Nadder", ElementType.WIND, 40, 30);
            saveDragon("Thunderdrum", ElementType.ELECTRIC, 50, 20);
            System.out.println(">> Berhasil menyimpan naga liar awal ke database");
        }

        // 2. Inisialisasi Musuh (Enemy) untuk Battle
        if (enemyRepository.count() == 0) {
            // Parameter disesuaikan: saveEnemy(type, maxHealth, attack, posX, posY)
            saveEnemy("Shadow Skullker", 80, 15, 600, 190);
            saveEnemy("Forest Troll", 150, 25, 900, 190);
            saveEnemy("Fire Slime", 50, 10, 1200, 190);
            System.out.println(">> Berhasil menyimpan musuh awal ke database");
        }

        // 3. Inisialisasi Hero
        if (heroRepository.count() == 0) {
            saveHero("Wizard", 0);
            System.out.println(">> Berhasil menyimpan hero awal ke database");
        }
    }


    // Helper method untuk Naga
    private void saveDragon(String name, ElementType element, int atk, int def) {
        Dragon d = new Dragon();
        d.setName(name);
        d.setElement(element);
        d.setHealth(100);
        d.setMana(100);
        d.setAttack(atk);
        d.setDefense(def);
        dragonRepository.save(d);
    }

    // 🔥 PERBAIKAN: Helper method disesuaikan dengan Constructor & Properti class Enemy
    private void saveEnemy(String type, int maxHp, int atk, int posX, int posY) {
        Enemy m = new Enemy();
        m.setType(type);
        m.setMaxHealth(maxHp);
        m.setHealth(maxHp); // Set HP awal sama dengan Max HP
        m.setAttack(atk);
        m.setPosX(posX);
        m.setPosY(posY);
        m.setDead(false);
        enemyRepository.save(m);
    }

    // Helper method untuk Hero
    private void saveHero(String name, int xp) {
        Hero h = new Hero(name);
        h.setExperience(xp);
        heroRepository.save(h);
    }
}