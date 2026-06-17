package com.dragonworld.game.model;

import jakarta.persistence.*;

@Entity
@Table(name = "SAVE_SLOT")
public class SaveSlot {
    @Id
    private Long id; // Kita kunci nilainya menjadi 1, 2, atau 3 sesuai nomor slot di UI Canvas

    @Column(name = "save_name", nullable = false)
    private String saveName; // Isi database berupa nama dari save state (misal: "MAMAT", "PROGRES_AWAL")

    // Kolom tambahan opsional untuk menyimpan status gameplay
    private int playerLevel;
    private String selectedDragonName;

    // ====== CONSTRUCTOR ======
    public SaveSlot() {}

    public SaveSlot(Long id, String saveName, int playerLevel, String selectedDragonName) {
        this.id = id;
        this.saveName = saveName;
        this.playerLevel = playerLevel;
        this.selectedDragonName = selectedDragonName;
    }

    // ====== GETTER & SETTER ======
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSaveName() { return saveName; }
    public void setSaveName(String saveName) { this.saveName = saveName; }

    public int getPlayerLevel() { return playerLevel; }
    public void setPlayerLevel(int playerLevel) { this.playerLevel = playerLevel; }

    public String getSelectedDragonName() { return selectedDragonName; }
    public void setSelectedDragonName(String selectedDragonName) { this.selectedDragonName = selectedDragonName; }
}
