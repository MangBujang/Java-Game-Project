package com.dragonworld.game.config;

import com.dragonworld.game.model.Dragon;
import com.dragonworld.game.model.ElementType;
import com.dragonworld.game.model.Monster;
import com.dragonworld.game.model.Hero;// Pastikan model Monster sudah dibuat
import com.dragonworld.game.repository.DragonRepository;
import com.dragonworld.game.repository.HeroRepository;
import com.dragonworld.game.repository.MonsterRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DragonRepository dragonRepository;
    private final HeroRepository heroRepository;
    private final MonsterRepository monsterRepository;

    // SATU Constructor untuk SEMUA repository
    public DataInitializer(DragonRepository dragonRepository, 
        HeroRepository heroRepository, 
        MonsterRepository monsterRepository) {
        this.dragonRepository = dragonRepository;
        this.heroRepository = heroRepository;
        this.monsterRepository = monsterRepository;
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

        // 2. Inisialisasi Monster untuk Battle
        if (monsterRepository.count() == 0) {
            saveMonster("Shadow Skullker", "DARK", 80, 15, 5, 50);
            saveMonster("Forest Troll", "EARTH", 150, 10, 20, 100);
            saveMonster("Fire Slime", "FIRE", 50, 20, 2, 30);
            System.out.println(">> Berhasil menyimpan monster awal ke database");
        }

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

    // Helper method untuk Monster
    private void saveMonster(String name, String type, int hp, int atk, int def, int xp) {
        Monster m = new Monster();
        m.setName(name);
        m.setHealth(hp);
        m.setAttack(atk);
        m.setDefense(def);
        m.setExperienceReward(xp);
        monsterRepository.save(m);
    }

    // Helper method untuk Hero
    private void saveHero(String name, int xp) {
        Hero h = new Hero(name);
        h.setExperience(xp);
        heroRepository.save(h);
    }
}