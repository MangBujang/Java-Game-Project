package com.dragonworld.game.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "SAVE_SLOT")
public class SaveSlot {
    @Id
    private Long id; // Kita kunci nilainya menjadi 1, 2, atau 3 sesuai nomor slot di UI Canvas

    @Column(name = "save_name", nullable = false)
    private String saveName; // Isi database berupa nama dari save state (misal: "MAMAT", "PROGRES_AWAL")

    private int playerLevel;

    // 🔥 TAMBAHAN: Kolom untuk menyimpan class hero (WIZARD, KNIGHT, ARCHER)
    @Column(name = "selected_character_name")
    private String selectedCharacterName;

    // ====== CONSTRUCTOR ======
    public SaveSlot() {}

    public SaveSlot(Long id, String saveName, int playerLevel, String selectedCharacterName) {
        this.id = id;
        this.saveName = saveName;
        this.playerLevel = playerLevel;
        this.selectedCharacterName = selectedCharacterName;
    }

    // ====== GETTER & SETTER ======
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSaveName() { return saveName; }
    public void setSaveName(String saveName) { this.saveName = saveName; }

    public int getPlayerLevel() { return playerLevel; }
    public void setPlayerLevel(int playerLevel) { this.playerLevel = playerLevel; }

    // 🔥 TAMBAHAN: Getter & Setter untuk Class Hero
    public String getSelectedCharacterName() { return selectedCharacterName; }
    public void setSelectedCharacterName(String selectedCharacterName) { this.selectedCharacterName = selectedCharacterName; }
}