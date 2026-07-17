package com.dragonworld.game.model;

import jakarta.persistence.*;

@Entity
@Table(name = "enemy")
public class Enemy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String type; // Contoh: "GOBLIN", "ORC", "BOSS"
    private int health;
    private int maxHealth;
    private int attack;
    
    @Column(name = "posx")
    private int posX;
    @Column(name = "posy")
    private int posY;
    
    private boolean isDead = false;

    public Enemy() {}

    public Enemy(String type, int maxHealth, int attack, int posX, int posY) {
        this.type = type;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.attack = attack;
        this.posX = posX;
        this.posY = posY;
        this.isDead = false;
    }

    // ====== GETTER & SETTER ======
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getHealth() { return health; }
    public void setHealth(int health) { this.health = health; }

    public int getMaxHealth() { return maxHealth; }
    public void setMaxHealth(int maxHealth) { this.maxHealth = maxHealth; }

    public int getAttack() { return attack; }
    public void setAttack(int attack) { this.attack = attack; }

    public int getPosX() { return posX; }
    public void setPosX(int posX) { this.posX = posX; }

    public int getPosY() { return posY; }
    public void setPosY(int posY) { this.posY = posY; }

    public boolean isDead() { return isDead; }
    public void setDead(boolean dead) { isDead = dead; }
}