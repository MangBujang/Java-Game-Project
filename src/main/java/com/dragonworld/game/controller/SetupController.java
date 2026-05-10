package com.dragonworld.game.controller;

import com.dragonworld.game.model.Dragon;
import com.dragonworld.game.model.ElementType;
import com.dragonworld.game.model.Hero;
import com.dragonworld.game.repository.DragonRepository;
import com.dragonworld.game.repository.HeroRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/setup")
@CrossOrigin(origins = "*")
public class SetupController {
    
    private final HeroRepository heroRepository;
    private final DragonRepository dragonRepository;

    public SetupController(HeroRepository heroRepository, DragonRepository dragonRepository) {
        this.heroRepository = heroRepository;
        this.dragonRepository = dragonRepository;
    }

    @PostMapping("/register")
    public String registerHero(@RequestBody Map<String, String> payload) {

        System.out.println("Isi Payload: " + payload);
        String heroName = payload.get("name");
        System.out.println("Nama Hero yang ditangkap: " + heroName);

        // Ambil data dari payload
        String petName = payload.get("petName");
        String elementStr = payload.get("element");
    
        // 1. Buat Objek Hero
        Hero hero = new Hero(heroName);
        
        // 2. Buat Objek Dragon
        ElementType selectedElementType = ElementType.valueOf(elementStr.toUpperCase());
        Dragon pet = new Dragon();
        pet.setName(petName);
        pet.setElement(selectedElementType);
        pet.setHealth(100);
        pet.setMana(100);
        pet.setAttack(40);
        pet.setDefense(30);
        
        // 3. Hubungkan Relasi (Dua Arah)
        pet.setOwner(hero);
        hero.addDragon(pet); // Pastikan method ini ada di Hero.java
    
        // 4. SIMPAN SEKALIGUS
        // Karena di Hero.java ada cascade = CascadeType.ALL, 
        // menyimpan hero otomatis akan menyimpan dragon-nya dengan benar.
        heroRepository.save(hero); 
    
        return "Petualangan dimulai! Selamat datang " + heroName + " dan " + petName;
    }
    
    

    @GetMapping("/current-hero")
    public Hero getCurrentHero() {
        // Untuk demo, kita ambil hero pertama yang ada di database
        return heroRepository.findAll().stream().findFirst().orElse(null);
    }
}
