package com.dragonworld.game.model;

import jakarta.persistence.*;

@Entity
public class Monster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int health;
    private int attack;
    private int defense;
    private int experienceReward;

    
    public Monster() {
    }

    public Monster(String name, int health, int attack, int defense, int XP) {
        
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.experienceReward = XP;
    }
    

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getHealth() { return health; }
    public void setHealth(int health) { this.health = health; }
    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }
    public int getDefense() { return defense; }
    public void setDefense(int defense) { this.defense = defense; }
    public int getExperienceReward() { return experienceReward; }
    public void setExperienceReward(int experienceReward) { this.experienceReward = experienceReward; }
}

