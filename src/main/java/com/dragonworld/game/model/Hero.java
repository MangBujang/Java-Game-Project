package com.dragonworld.game.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hero") // Opsional: Memastikan nama tabel di database adalah 'hero'
public class Hero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int experience;
    private int level;

    @Column(name = "posx") // Menyesuaikan ejaan database yang biasanya lowercase
    private int posX;
    @Column(name = "posy")
    private int posY;

    private int health = 100;
    
    @Column(name = "max_health") // Menyesuaikan snake_case di database kamu
    private int maxHealth = 100;
    
    private int attack = 25;
    private int defense = 15;

    // Constructor Kosong (Wajib untuk JPA)
    public Hero() {}

    // Constructor dengan parameter nama
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

    // ====== GETTER & SETTER STANDAR ======
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public int getPosX() { return posX; }
    public void setPosX(int posX) { this.posX = posX; }

    public int getPosY() { return posY; }
    public void setPosY(int posY) { this.posY = posY; }

    // ====== 🔥 TAMBAHAN: GETTER & SETTER UNTUK STATISTIK SINKRONISASI GAME ======
    public int getHealth() { return health; }
    public void setHealth(int health) { this.health = health; }

    public int getMaxHealth() { return maxHealth; }
    public void setMaxHealth(int maxHealth) { this.maxHealth = maxHealth; }

    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }

    public int getDefense() { return defense; }
    public void setDefense(int defense) { this.defense = defense; }
}