package com.dragonworld.game.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Hero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int experience;
    private int level;

    private int posX;
    private int posY;

    private int health = 100;
    private int maxHealth = 100;
    private int attack = 25;
    private int defense = 15;


    public Hero() {}

    public Hero (String name) {
        this.name = name;
        this.experience = 0;
        this.level = 1;
        this.posX = 0;
        this.posY = 0;   
        this.health = 100;
        this.maxHealth = 100;
        this.attack = 25;
        this.defense = 15;
    }

    // Getter & Setter untuk ID
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; } // Tambahkan ini

    // Getter & Setter untuk Name
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // Getter & Setter untuk Experience
    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    // Getter & Setter untuk Level (PENTING: tambahkan setter agar level bisa diupdate)
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getPosX() { return posX; }
    public void setPosX(int posX) { this.posX = posX; }

    public int getPosY() { return posY; }
    public void setPosY(int posY) { this.posY = posY; }

}