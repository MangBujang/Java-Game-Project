package com.dragonworld.game.service;

import org.springframework.stereotype.Service;
import com.dragonworld.game.model.Dragon;
import com.dragonworld.game.model.ElementType;
import com.dragonworld.game.model.Monster;

@Service
public class BattleService {

    public String attack(Dragon pet, Monster monster) {
        int Damage = pet.getAttack() - monster.getDefense();
        if (Damage < 5) Damage = 5;

        int newHP = monster.getHealth() - Damage;
        monster.setHealth(newHP);

        return pet.getName() + "Menyerang" + monster.getName() + "Sebesar" + Damage + "damage!";
    }

    private double getElementModifier(ElementType atk, ElementType def) {
        
        if (atk == ElementType.FIRE) {
            if(def == ElementType.WIND) return 1.5;
            if(def == ElementType.WATER) return 0.5;
        }

        if (atk == ElementType.WATER) {
            if(def == ElementType.FIRE) return 1.5;
            if(def == ElementType.EARTH) return 0.5;
        }

        if (atk == ElementType.EARTH) {
            if(def == ElementType.WATER) return 1.5;
            if(def == ElementType.WIND) return 0.5;
        }

        if (atk == ElementType.WIND) {
            if(def == ElementType.EARTH) return 1.5;
            if(def == ElementType.FIRE) return 0.5;
        }
        

        return 1.0;
        
    }
}
