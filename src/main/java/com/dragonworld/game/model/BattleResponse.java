package com.dragonworld.game.model;

public class BattleResponse {
    private String message;
    private int heroHp;
    private int monsterHp;

    public BattleResponse(String message, int heroHp, int monsterHp) {
        this.message = message;
        this.heroHp = heroHp;
        this.monsterHp = monsterHp;
    }

    // Getter (Penting agar Spring bisa mengubahnya jadi JSON)
    public String getMessage() { return message; }
    public int getHeroHp() { return heroHp; }
    public int getMonsterHp() { return monsterHp; }
}