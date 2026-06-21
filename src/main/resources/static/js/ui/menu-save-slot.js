// ====== 1. STATUS GLOBAL UNTUK MANAGEMENT SLOT FROM H2 ======
let dbSlotsData = {}; 

const saveScreenConfig = {
    backgroundColor: "#2a2f35", 
    borderColor: "#57606f",
    borderWidth: 6,
    slotWidth: 600,    
    slotHeight: 80,    
    gap: 15            
};

let deleteButtonsCoords = {};

// ====== 2. FUNGSI FETCH DATA DARI DATABASE H2 (GET) ======
function loadAllSlotsFromDatabase() {
    fetch("/api/slots")
        .then(response => {
            if (!response.ok) throw new Error("Gagal mengambil data slot");
            return response.json();
        })
        .then(data => {
            dbSlotsData = {};
            data.forEach(slot => {
                dbSlotsData[slot.id] = slot;
            });
            console.log("[H2 SINKRONISASI] Data lokal diperbarui dari database:", dbSlotsData);
        })
        .catch(error => {
            console.error("Error database saat load slot:", error);
        });
}

// Jalankan fetch awal saat pertama kali script dimuat
loadAllSlotsFromDatabase();

function saveNewSlotToDatabase(slotId, heroName) {
    const payload = {
        id: slotId,
        saveName: heroName,
        playerLevel: 1
    };

    // Menggunakan PUT/POST sesuai endpoint Controller Spring Boot kamu
    return fetch(`/api/slots`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error("Gagal menyimpan data ke H2");
        console.log(`[H2 PERSISTENCE] Slot ${slotId} berhasil dikomit dengan nama: ${heroName}`);
        loadAllSlotsFromDatabase(); // Refresh data lokal setelah berhasil disimpan
    })
    .catch(err => console.error("Gagal melakukan sinkronisasi database:", err));
}

// ====== 3. FUNGSI UTAMA MENGGAMBAR MENU SAVE SLOT ======
function drawSaveSlotsScreen(ctx, canvasWidth, canvasHeight) {
    const containerX = (canvasWidth - 700) / 2;
    const containerY = (canvasHeight - 380) / 2;
    
    ctx.fillStyle = saveScreenConfig.backgroundColor;
    ctx.fillRect(containerX, containerY, 700, 380);
    ctx.strokeStyle = saveScreenConfig.borderColor;
    ctx.lineWidth = saveScreenConfig.borderWidth;
    ctx.strokeRect(containerX, containerY, 700, 380);

    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Select save slot", canvasWidth / 2, containerY + 25);

    deleteButtonsCoords = {}; 

    const sX = containerX + (700 - saveScreenConfig.slotWidth) / 2; 
    const startY = containerY + 70; 

    for (let i = 1; i <= 3; i++) {
        let sY = startY + ((i - 1) * (saveScreenConfig.slotHeight + saveScreenConfig.gap));
        let sW = saveScreenConfig.slotWidth;
        let sH = saveScreenConfig.slotHeight;

        const slotData = dbSlotsData[i]; 

        ctx.fillStyle = "#1e222b";
        ctx.fillRect(sX, sY, sW, sH);
        ctx.strokeStyle = "#4b5563";
        ctx.lineWidth = 2;
        ctx.strokeRect(sX, sY, sW, sH);

        ctx.textBaseline = "middle";

        // Periksa properti database 'saveName' atau 'name' secara aman
        if (slotData && (slotData.saveName || slotData.name)) {
            let displayedName = slotData.saveName || slotData.name;
            
            if (displayedName.trim() !== "" && displayedName.toLowerCase() !== "none" && displayedName.toLowerCase() !== "null") {
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "left";
                ctx.font = "12px 'Press Start 2P'";
                ctx.fillText(displayedName.toUpperCase(), sX + 30, sY + (sH / 2) - 12);
                
                ctx.fillStyle = "#a1a1aa";
                ctx.font = "8px 'Press Start 2P'";
                ctx.fillText(`LV.${slotData.playerLevel || slotData.level || 1} - H2 DATABASE`, sX + 30, sY + (sH / 2) + 15);

                // Tombol Hapus [ X ]
                let btnW = 35; let btnH = 35;
                let btnX = sX + sW - 50;
                let btnY = sY + (sH - btnH) / 2;

                deleteButtonsCoords[i] = { x: btnX, y: btnY, w: btnW, h: btnH };

                ctx.fillStyle = "rgba(255, 71, 87, 0.3)"; 
                ctx.fillRect(btnX, btnY, btnW, btnH);
                ctx.strokeStyle = "#ff4757";
                ctx.lineWidth = 2;
                ctx.strokeRect(btnX, btnY, btnW, btnH);

                ctx.fillStyle = "#ff4757";
                ctx.font = "10px 'Press Start 2P'";
                ctx.textAlign = "center";
                ctx.fillText("X", btnX + (btnW / 2), btnY + (btnH / 2) + 2);
                continue; 
            }
        }
        
        // Render jika slot kosong
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "14px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("Empty Slot", sX + (sW / 2), sY + (sH / 2));
    }
}

// ====== 4. INTERAKSI KLIK MOUSE PADA MENU SAVE SLOT ======

document.getElementById("gameCanvas").addEventListener("click", (event) => {
    if (gameState !== "SAVE_SLOT_MENU") return;

    const currentCanvas = document.getElementById("gameCanvas");
    const rect = currentCanvas.getBoundingClientRect();

    const mouseX = ((event.clientX - rect.left) / rect.width) * currentCanvas.width;
    const mouseY = ((event.clientY - rect.top) / rect.height) * currentCanvas.height;

    const containerX = (currentCanvas.width - 700) / 2;
    const containerY = (currentCanvas.height - 380) / 2;
    
    const sX = containerX + (700 - saveScreenConfig.slotWidth) / 2;
    const startY = containerY + 70;

    for (let i = 1; i <= 3; i++) {
        let sY = startY + ((i - 1) * (saveScreenConfig.slotHeight + saveScreenConfig.gap));
        let sW = saveScreenConfig.slotWidth;
        let sH = saveScreenConfig.slotHeight;

        // Aksi klik hapus data [ X ]
        if (deleteButtonsCoords[i]) {
            let btn = deleteButtonsCoords[i];
            if (mouseX >= btn.x && mouseX <= btn.x + btn.w &&
                mouseY >= btn.y && mouseY <= btn.y + btn.h) {
                
                if (confirm(`Hapus data SLOT ${i} di database H2?`)) {
                    fetch(`/api/slots/${i}`, { method: "DELETE" })
                        .then(res => {
                            if (res.ok) {
                                loadAllSlotsFromDatabase(); 
                            } else {
                                alert("Gagal menghapus data.");
                            }
                        })
                        .catch(err => console.error(err));
                }
                return; 
            }
        }

        // Aksi klik area slot utama
        if (mouseX >= sX && mouseX <= sX + sW && mouseY >= sY && mouseY <= sY + sH) {
            currentSaveSlot = i; 
            const slotData = dbSlotsData[i];

            let hasValidName = false;
            let loadedName = "";

            if (slotData) {
                let namaProperti = slotData.saveName || slotData.name; 
                if (namaProperti && namaProperti.trim() !== "" && namaProperti.toLowerCase() !== "none" && namaProperti.toLowerCase() !== "null") {
                    hasValidName = true;
                    loadedName = namaProperti.trim();
                }
            }

            if (hasValidName) {
                // LOAD DATA: Jika slot berisi, muat data dan langsung jalankan game atau ke pilihan class jika belum ada
                playerCharacter = {
                    name: loadedName,
                    level: slotData.playerLevel || slotData.level || 1,
                    selectedCharacterName: slotData.selectedCharacterName || "None"
                };
                
                if (playerCharacter.selectedCharacterName === "None") {
                    gameState = "SELECT_CHARACTER";
                } else {
                    gameState = "PLAYING"; 
                }
            } else {
                // NEW DATA: Jika slot kosong, bersihkan nama global dan arahkan ke layar input nama
                playerCharacter.name = "";
                playerCharacter.selectedCharacterName = "None";
                gameState = "INPUT_NAME";
            }
            return;
        }
    }
});