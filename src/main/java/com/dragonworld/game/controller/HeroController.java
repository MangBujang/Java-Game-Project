package com.dragonworld.game.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dragonworld.game.model.Hero;
import com.dragonworld.game.repository.HeroRepository;

@RestController
// Ubah mapping ke /api/heroes agar tidak bentrok dengan data /api/slots
@RequestMapping("/api/heroes") 
@CrossOrigin(origins = "*")
public class HeroController {

    @Autowired
    private HeroRepository heroRepository;

    // Endpoint GET untuk mengambil semua list master hero (Wizard, Knight, Archer)
    @GetMapping
    public List<Hero> getAllHeroes() {
        return heroRepository.findAll();
    }
}