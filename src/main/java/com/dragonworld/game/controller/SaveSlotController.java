package com.dragonworld.game.controller;


import com.dragonworld.game.model.SaveSlot;
import com.dragonworld.game.repository.SaveSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/save-slots")
@CrossOrigin(origins = "*")
public class SaveSlotController {

    @Autowired
    private SaveSlotRepository saveSlotRepository;

    // 1. Ambil semua data slot save game (GET /api/slots)
    @GetMapping
    public List<SaveSlot> getAllSlots() {
        return saveSlotRepository.findAll();
    }

    // 2. Simpan atau buat save state baru (POST /api/slots)
    @PostMapping
    public SaveSlot createOrUpdateSave(@RequestBody SaveSlot saveSlot) {
        return saveSlotRepository.save(saveSlot);
    }

    // 3. Hapus data save state berdasarkan nomor slot (DELETE /api/slots/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSaveSlot(@PathVariable Long id) {
        if (saveSlotRepository.existsById(id)) {
            saveSlotRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

}
