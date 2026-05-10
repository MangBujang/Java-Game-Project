package com.dragonworld.game.controller;

import com.dragonworld.game.model.Dragon;
import com.dragonworld.game.model.Hero;
import com.dragonworld.game.model.Monster;
import com.dragonworld.game.repository.DragonRepository;
import com.dragonworld.game.repository.HeroRepository; // Tambahkan import ini
import com.dragonworld.game.repository.MonsterRepository;
import com.dragonworld.game.service.BattleService;
import com.dragonworld.game.model.BattleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/battle")
public class BattleController {

    @Autowired
    private BattleService battleService;

    @Autowired
    private DragonRepository dragonRepository;

    @Autowired
    private HeroRepository heroRepository; // Tambahkan ini

    @Autowired
    private MonsterRepository monsterRepository;


    @GetMapping("/hero/{heroId}/attack/{monsterId}")
    public BattleResponse fight(@PathVariable Long heroId, @PathVariable Long monsterId) {
        Hero hero = heroRepository.findById(heroId)
                .orElseThrow(() -> new RuntimeException("Hero tidak ditemukan"));

        if (hero.getDragons().isEmpty()) {
            return new BattleResponse("Hero tidak memiliki naga!", 0, 0);
        }
        Dragon pet = hero.getDragons().get(0); 
        
        Monster monster = monsterRepository.findById(monsterId)
                .orElseThrow(() -> new RuntimeException("Monster liar tidak ditemukan"));

        // Lakukan pertarungan via service
        String log = battleService.attack(pet, monster);

        // Logika mendapatkan XP jika monster dikalahkan
        if (monster.getHealth() <= 0) {
            int xpGained = monster.getExperienceReward();
            hero.setExperience(hero.getExperience() + xpGained);
            log += " | Monster dikalahkan! " + hero.getName() + " mendapatkan " + xpGained + " XP.";
        }

        // Simpan status terbaru ke Database (CRUD Update)
        monsterRepository.save(monster);
        dragonRepository.save(pet);
        heroRepository.save(hero); // Simpan perubahan XP hero

        // Kirim data lengkap ke Frontend
        return new BattleResponse(log, pet.getHealth(), monster.getHealth());
    }
}