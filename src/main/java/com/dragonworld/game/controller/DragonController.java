package com.dragonworld.game.controller;

import com.dragonworld.game.model.Dragon;
import com.dragonworld.game.repository.DragonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dragons")
@CrossOrigin(origins = "*")
public class DragonController {

    @Autowired
    private DragonRepository dragonRepository;

    @GetMapping
    public List<Dragon> getAllDragons() {
        return dragonRepository.findAll();
    }
}