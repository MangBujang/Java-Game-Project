package com.dragonworld.game.dto;

public class AttackRequest {
    private Long heroId;
    private Long enemyId;

    public Long getHeroId() { return heroId; }
    public void setHeroId(Long heroId) { this.heroId = heroId; }

    public Long getEnemyId() { return enemyId; }
    public void setEnemyId(Long enemyId) { this.enemyId = enemyId; }
}