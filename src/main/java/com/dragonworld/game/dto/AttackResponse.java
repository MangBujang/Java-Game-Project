package com.dragonworld.game.dto;

public class AttackResponse {
    private String message;
    private int damageDealt;
    private int enemyHealth;
    private boolean enemyIsDead;
    private int heroHealth;
    private int heroExp;
    private int heroLevel;

    // Default Constructor (opsional, untuk fleksibilitas Jackson/JSON)
    public AttackResponse() {}

    // Constructor lengkap yang digunakan oleh CombatService
    public AttackResponse(String message, int damageDealt, int enemyHealth, 
                          boolean enemyIsDead, int heroHealth, int heroExp, int heroLevel) {
        this.message = message;
        this.damageDealt = damageDealt;
        this.enemyHealth = enemyHealth;
        this.enemyIsDead = enemyIsDead;
        this.heroHealth = heroHealth;
        this.heroExp = heroExp;
        this.heroLevel = heroLevel;
    }

    // ==========================================
    // GETTER & SETTER (Wajib ada untuk serialize ke JSON)
    // ==========================================
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getDamageDealt() { return damageDealt; }
    public void setDamageDealt(int damageDealt) { this.damageDealt = damageDealt; }

    public int getEnemyHealth() { return enemyHealth; }
    public void setEnemyHealth(int enemyHealth) { this.enemyHealth = enemyHealth; }

    public boolean isEnemyIsDead() { return enemyIsDead; }
    public void setEnemyIsDead(boolean enemyIsDead) { this.enemyIsDead = enemyIsDead; }

    public int getHeroHealth() { return heroHealth; }
    public void setHeroHealth(int heroHealth) { this.heroHealth = heroHealth; }

    public int getHeroExp() { return heroExp; }
    public void setHeroExp(int heroExp) { this.heroExp = heroExp; }

    public int getHeroLevel() { return heroLevel; }
    public void setHeroLevel(int heroLevel) { this.heroLevel = heroLevel; }
}