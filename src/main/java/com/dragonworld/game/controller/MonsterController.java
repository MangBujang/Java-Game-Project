package com.dragonworld.game.controller;

import com.dragonworld.game.model.Monster;
import com.dragonworld.game.repository.MonsterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/monsters")
public class MonsterController {

    @Autowired
    private MonsterRepository monsterRepository;

    @GetMapping("/random")
    public ResponseEntity<Monster> getRandomMonster() {
        List<Monster> monsters = monsterRepository.findAll();
        
        if (monsters.isEmpty()) {
            // Jika database kosong, kirim monster default agar tidak error
            return ResponseEntity.ok(new Monster("Shadow Skullker", 100, 10, 5, 50));
        }
        
        // Acak list monster dan ambil yang pertama
        Collections.shuffle(monsters);
        return ResponseEntity.ok(monsters.get(0));
    }
}