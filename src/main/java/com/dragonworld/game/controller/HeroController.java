// package com.dragonworld.game.controller;

// import com.dragonworld.game.model.Hero;
// import com.dragonworld.game.repository.HeroRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Optional;

// @RestController
// @RequestMapping("/api/slots")
// @CrossOrigin(origins = "*")

// public class HeroController {
//     @Autowired
//     private HeroRepository heroRepository;

//     // A. MENGAMBIL SEMUA DATA SLOT (Untuk dicek di UI menu save)
//     @GetMapping
//     public List<Hero> getAllSlots() {
//         return heroRepository.findAll();
//     }

//     // B. SIMPAN ATAU UPDATE DATA SLOT (SAVE GAME)
//     @PostMapping("/{slotId}")
//     public ResponseEntity<Hero> saveGame(@PathVariable Long slotId, @RequestBody Hero newHeroData) {
//         // Set ID Hero secara manual sesuai nomor slot (1, 2, atau 3)
//         newHeroData.setId(slotId);
//         Hero savedHero = heroRepository.save(newHeroData);
//         return ResponseEntity.ok(savedHero);
//     }

//     // C. HAPUS DATA SLOT (DELETE SAVE STATE)
//     @DeleteMapping("/{slotId}")
//     public ResponseEntity<String> deleteSaveState(@PathVariable Long slotId) {
//         if (heroRepository.existsById(slotId)) {
//             heroRepository.deleteById(slotId);
//             return ResponseEntity.ok("Slot " + slotId + " berhasil dihapus dari database!");
//         } else {
//             return ResponseEntity.notFound().build();
//         }
//     }
// }
