package com.dragonworld.game.controller;

import com.dragonworld.game.dto.AttackRequest;
import com.dragonworld.game.dto.AttackResponse;
import com.dragonworld.game.service.CombatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/combat")
@CrossOrigin(origins = "*")
public class CombatController {

    private final CombatService combatService;

    // 🔥 Inject CombatService melalui constructor
    public CombatController(CombatService combatService) {
        this.combatService = combatService;
    }

    // ⚔️ SATU-SATUNYA ENDPOINT YANG DIBUTUHKAN UNTUK PERTEMPURAN
    // Logika menyerang, serangan balasan musuh, penambahan EXP, 
    // dan naik level di-handle secara otomatis di dalam combatService.
    @PostMapping("/hero-attack")
    public ResponseEntity<AttackResponse> heroAttack(@RequestBody AttackRequest request) {
        try {
            AttackResponse response = combatService.heroAttack(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Mengembalikan status 400 Bad Request jika ID tidak valid/tidak ditemukan
            return ResponseEntity.badRequest().build();
        }
    }
}