package com.dragonworld.game.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "DRAGON")
@Data
public class Dragon {
    @ManyToOne
    @JoinColumn(name = "hero_id")
    private Hero owner;

    public Hero getOwner() {return owner;  }
    public void setOwner(Hero owner) {this.owner = owner; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int level = 1;
    private int xp = 0;

    private int health;
    private int maxHealth;
    private int mana;
    private int maxMana;

    private int attack;
    private int defense;

    @Enumerated(EnumType.STRING)
    private ElementType element;

    // Method umum untuk semua naga
    public void takeDamage(int amount) {
        int damageAfterDefense = Math.max(0, amount - this.defense);
        this.health = Math.max(0, this.health - damageAfterDefense);
    }

    public boolean isAlive() {
        return this.health > 0;
    }

    public void heal(int amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
}

