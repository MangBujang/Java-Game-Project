// ====== 1. STATUS GLOBAL & KONFIGURASI LAYAR ======
let dbSlotsData = {}; 

const saveScreenConfig = {
    // Menyesuaikan koordinat container box luar di gambar kamu
    x: 40,
    y: 30,
    width: 720,
    height: 390,
    backgroundColor: "#1e222b",
    borderColor: "#4b5563",
    borderWidth: 4,
    
    // Dimensi 3 Kotak Slot (Presisi mengikuti screenshot kamu)
    slotX: 80,
    slotWidth: 640,
    slotHeight: 80,
    startY: 95,
    gap: 15
};

let deleteButtonsCoords = {};

// ====== 2. FUNGSI FETCH DATA DARI DATABASE H2 (GET) ======
function loadAllSlotsFromDatabase() {
    // PERBAIKAN: Ubah URL dari "/api/save-" menjadi "/api/slots" sesuai controller Spring Boot
    fetch("/api/save-slots")
        .then(response => {
            if (!response.ok) throw new Error("Gagal mengambil data slot");
            return response.json();
        })
        .then(data => {
            dbSlotsData = {};
            data.forEach(hero => {
                dbSlotsData[hero.id] = hero;
            });
            console.log("Data Slot H2 berhasil diperbarui:", dbSlotsData);
        })
        .catch(error => {
            console.error("Error database saat load slot:", error);
        });
}

loadAllSlotsFromDatabase();

// ====== 3. FUNGSI UTAMA MENGGAMBAR MENU SAVE SLOT ======
function drawSaveSlotsScreen(ctx, canvasWidth, canvasHeight) {
    // --- A. Gambar Background Menu Utama ---
    ctx.fillStyle = saveScreenConfig.backgroundColor;
    ctx.fillRect(saveScreenConfig.x, saveScreenConfig.y, saveScreenConfig.width, saveScreenConfig.height);
    
    ctx.strokeStyle = saveScreenConfig.borderColor;
    ctx.lineWidth = saveScreenConfig.borderWidth;
    ctx.strokeRect(saveScreenConfig.x, saveScreenConfig.y, saveScreenConfig.width, saveScreenConfig.height);

    // --- B. Gambar Judul Atas ---
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Select save slot", canvasWidth / 2, saveScreenConfig.y + 25);

    // --- C. Loop untuk Menggambar 3 Slot ---
    deleteButtonsCoords = {}; 

    for (let i = 1; i <= 3; i++) {
        let sX = saveScreenConfig.slotX;
        let sY = saveScreenConfig.startY + ((i - 1) * (saveScreenConfig.slotHeight + saveScreenConfig.gap));
        let sW = saveScreenConfig.slotWidth;
        let sH = saveScreenConfig.slotHeight;

        const slotData = dbSlotsData[i]; 

        // 1. Gambar Container Slot Utama
        ctx.fillStyle = "#1e222b";
        ctx.fillRect(sX, sY, sW, sH);
        ctx.strokeStyle = "#4b5563";
        ctx.lineWidth = 2;
        ctx.strokeRect(sX, sY, sW, sH);

        ctx.textBaseline = "middle";

        deletButtonsCoords = {};

        for (let i = 1; i <= 3; i++) {
            let sX = saveScreenConfig.slotX;
            let sY = saveScreenConfig.startY + ((i - 1) * (saveScreenConfig.slotHeight + saveScreenConfig.gap));
            let sW = saveScreenConfig.slotWidth;
            let sH = saveScreenConfig.slotHeight;

            const slotData = dbSlotsData[i];
            ctx.fillStyle = "rgba(31, 41, 55, 0.7)";
            ctx.fillRect(sX, sY, sW, sH);
            ctx.strokeStyle = "#4b5563";
            ctx.lineWidth = 2;
            ctx.strokeRect(sX, sY, sW, sH);

            ctx.textBaseline = "middle";
        }
        if (slotData) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "14px 'Press Start 2P'";
            ctx.textAlign = "left";

            ctx.fillText(slotData.saveName.toUpperCase(), sX + 40, sY + (sH / 2));
            
            ctx.fillStyle = "#a1a1aa";
            ctx.font = "8px 'Press Start 2P'";
            ctx.fillText(`LV.${slotData.playerLevel || 1}`, sX + 40, sY + (sH / 2) + 20);

            // --- TOMBOL OPTION HAPUS (X) MERAH DI UJUNG KANAN ---
            let btnW = 40;
            let btnH = 40;
            let btnX = sX + sW - 60;
            let btnY = sY + (sH - btnH) / 2;

            // Catat koordinat tombol untuk deteksi klik mouse
            deleteButtonsCoords[i] = { x: btnX, y: btnY, w: btnW, h: btnH };

            // Gambar kotak merah tombol X
            ctx.fillStyle = "#ff4757";
            ctx.fillRect(btnX, btnY, btnW, btnH);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.strokeRect(btnX, btnY, btnW, btnH);

            // Teks huruf X putih di tengah tombol merah
            ctx.fillStyle = "#ffffff";
            ctx.font = "12px 'Press Start 2P'";
            ctx.textAlign = "center";
            ctx.fillText("X", btnX + (btnW / 2), btnY + (btnH / 2) + 1);

        } else {
            // JIKA SLOT KOSONG (Empty)
            ctx.fillStyle = "#6b7280";
            ctx.font = "14px 'Press Start 2P'";
            ctx.textAlign = "center";
            ctx.fillText("Empty", sX + (sW / 2), sY + (sH / 2));
        }
    }
}

// ====== 4. INTERAKSI KLIK MOUSE PADA MENU SAVE SLOT ======
canvas.addEventListener("click", (event) => {
    // PERBAIKAN: Izinkan klik bekerja baik pada state SELECT_SLOT maupun SAVE_SLOT_MENU
    if (gameState !== "SAVE_SLOT_MENU" && gameState !== "SELECT_SLOT") return; 

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const sX = 80;
    const sW = 640;
    const sH = 80;
    const startY = 95;
    const gap = 15;

    for (let i = 1; i <= 3; i++) {
        let sY = startY + ((i - 1) * (sH + gap));

        // --- AKSI A: DETEKSI KLIK TOMBOL HAPUS "X" ---
        if (deleteButtonsCoords[i]) {
            let btn = deleteButtonsCoords[i];
            if (mouseX >= btn.x && mouseX <= btn.x + btn.w &&
                mouseY >= btn.y && mouseY <= btn.y + btn.h) {
                
                let konfirmasi = confirm(`Apakah kamu yakin ingin menghapus data SLOT ${i}?`);
                if (konfirmasi) {
                    fetch(`/api/slots/${i}`, { method: "DELETE" })
                        .then(res => {
                            if (res.ok) {
                                console.log(`Slot ${i} sukses dihapus.`);
                                loadAllSlotsFromDatabase(); // Segarkan tampilan UI
                            }
                        })
                        .catch(err => console.error("Error saat menghapus:", err));
                }
                return; // Interupsi agar tidak memicu masuk gameplay
            }
        }

        // --- AKSI B: DETEKSI KLIK AREA KOTAK SLOT (LOAD / CREATE) ---
        if (mouseX >= sX && mouseX <= sX + sW &&
            mouseY >= sY && mouseY <= sY + sH) {
            
            currentSaveSlot = i; 
            const slotData = dbSlotsData[i];

            if (slotData && slotData.saveName && slotData.saveName.trim() !== "") {
                // JIKA TERISI: Load data ke variable global game
                playerCharacter = {
                    name: slotData.saveName,
                    level: slotData.playerLevel || 1,
                    selectedDragon: slotData.selectedDragonName !== "None" ? { name: slotData.selectedDragonName } : null
                };
                console.log(`Load Berhasil! Melanjutkan game: ${playerCharacter.name}`);
                gameState = "PLAYING"; 
            } else {
                // JIKA KOSONG (Empty): Reset nama karakter dan arahkan ke pengetikan nama
                playerCharacter.name = "";
                playerCharacter.selectedDragon = null;
                
                // Jika kamu menggunakan variabel internal pengetikan di menu-pilih, reset juga di sini:
                if (typeof typedName !== "undefined") typedName = ""; 
                
                console.log(`Slot ${i} Kosong. Beralih ke layar INPUT_NAME.`);
                gameState = "INPUT_NAME"; 
            }
            return;
        }
    }
});