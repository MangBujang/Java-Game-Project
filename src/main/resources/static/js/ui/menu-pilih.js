// ====== 1. DATA DAN KOORDINAT DINAMIS KARTU CLASS ======
let characterOptions = [
    { name: "WIZARD", color: "#3498db", description: "Pengendali elemen sihir", hp: 80, atk: 45, def: 10, x: 0, y: 0 },
    { name: "KNIGHT", color: "#e74c3c", description: "Pelindung garis depan", hp: 140, atk: 25, def: 35, x: 0, y: 0 },
    { name: "ARCHER", color: "#2ecc71", description: "Penembak jitu jarak jauh", hp: 100, atk: 40, def: 18, x: 0, y: 0 }
];

const charCardConfig = {
    width: 140,
    height: 250,
    gap: 30,
    yPosition: 160 // Posisi awal Y kartu
};

// ====== 2. FUNGSI UTAMA RENDERING (MENGGAMBAR) ======
function drawCharacterSelectionScreen(ctx, canvasWidth, canvasHeight) {
    // A. Background Utama Screen
    ctx.fillStyle = "#1e222b";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // B. Judul Menu
    ctx.fillStyle = "#ffcc00";
    ctx.font = "16px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("PILIH CLASS KARAKTERMU", canvasWidth / 2, 50);

    ctx.fillStyle = "#a1a1aa";
    ctx.font = "8px 'Press Start 2P'";
    ctx.fillText("Tentukan takdir dan gaya bertarungmu di dunia Dragonworld", canvasWidth / 2, 85);

    // C. Kalkulasi Posisi Kartu agar Otomatis Center di Canvas
    const totalWidth = (characterOptions.length * charCardConfig.width) + ((characterOptions.length - 1) * charCardConfig.gap);
    const startX = (canvasWidth - totalWidth) / 2;

    characterOptions.forEach((char, index) => {
        // Tentukan koordinat absolut untuk rendering dan deteksi klik
        char.x = startX + (index * (charCardConfig.width + charCardConfig.gap));
        char.y = charCardConfig.yPosition;

        // 1. Gambar Kotak Kontainer Kartu
        ctx.fillStyle = "#2a2f35";
        ctx.fillRect(char.x, char.y, charCardConfig.width, charCardConfig.height);
        ctx.strokeStyle = "#57606f";
        ctx.lineWidth = 2;
        ctx.strokeRect(char.x, char.y, charCardConfig.width, charCardConfig.height);

        // 2. Gambar Kotak Warna Representasi Kelas (Isi Atas)
        const blockW = charCardConfig.width - 20;
        const blockH = 70;
        const blockX = char.x + 10;
        const blockY = char.y + 15;
        
        ctx.fillStyle = char.color;
        ctx.fillRect(blockX, blockY, blockW, blockH);
        
        // Teks di dalam kotak warna
        ctx.fillStyle = "#ffffff";
        ctx.font = "8px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`[ ${char.name} ]`, blockX + (blockW / 2), blockY + (blockH / 2));

        // 3. Nama Kelas di bawah blok warna
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px 'Press Start 2P'";
        ctx.fillText(char.name, char.x + (charCardConfig.width / 2), char.y + 105);

        // 4. Deskripsi Singkat
        ctx.fillStyle = "#9ca3af";
        ctx.font = "5px 'Press Start 2P'";
        ctx.fillText(char.description, char.x + (charCardConfig.width / 2), char.y + 130);

        // 5. Statistik (HP, ATK, DEF)
        ctx.fillStyle = "#d1d5db";
        ctx.font = "7px 'Press Start 2P'";
        ctx.textAlign = "left";
        
        const statX = char.x + 15;
        ctx.fillText(`HP  : ${char.hp}`, statX, char.y + 165);
        ctx.fillText(`ATK : ${char.atk}`, statX, char.y + 185);
        ctx.fillText(`DEF : ${char.def}`, statX, char.y + 205);
    });
}

// ====== 3. INTERAKSI KLIK MOUSE PADA KARTU CHARACTER ======
document.getElementById("gameCanvas").addEventListener("click", (event) => {
    if (gameState !== "SELECT_CHARACTER") return;

    const currentCanvas = document.getElementById("gameCanvas");
    const rect = currentCanvas.getBoundingClientRect();

    // Hitung posisi klik mouse relatif terhadap resolusi internal canvas
    const mouseX = ((event.clientX - rect.left) / rect.width) * currentCanvas.width;
    const mouseY = ((event.clientY - rect.top) / rect.height) * currentCanvas.height;

    // Periksa kartu mana yang terkena klik
    for (let i = 0; i < characterOptions.length; i++) {
        const char = characterOptions[i];

        if (mouseX >= char.x && mouseX <= char.x + charCardConfig.width &&
            mouseY >= char.y && mouseY <= char.y + charCardConfig.height) {
            
            console.log(`[WORKFLOW] Kelas dipilih: ${char.name}`);
            
            // Simpan kelas terpilih ke objek global permainan
            playerCharacter.selectedCharacterName = char.name;

            // Jalankan fungsi update ke backend database H2 Spring Boot
            updateCharacterToDatabase(currentSaveSlot, char.name);
            break;
        }
    }
});

// ====== 4. API FETCH: KOMIT DATA FINAL KE DATABASE H2 ======
// ====== SESUAIKAN FUNGSI INI DI JAVASCRIPT PILIHAN KARAKTERMU ======
function updateCharacterToDatabase(slotId, className) {
    const payloadUpdate = {
        id: slotId,                           // ID ini yang akan dibaca oleh repository.save() untuk mendeteksi update
        saveName: playerCharacter.name,       // Tetap bawa nama yang diinput di awal
        playerLevel: 1,
        selectedCharacterName: className      // Kelas karakter baru (WIZARD/KNIGHT/ARCHER)
    };

    // 🔥 PERBAIKAN: Gunakan POST dan hapus "/${slotId}" dari URL agar cocok dengan Java Controller-mu
    fetch("/api/slots", {
        method: "POST", // Harus POST sesuai @PostMapping di Java
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadUpdate)
    })
    .then(response => {
        if (!response.ok) throw new Error("Gagal mengupdate kelas karakter ke database H2");
        return response.json();
    })
    .then(data => {
        console.log("[H2 DATABASE SUCCESS] Karakter berhasil disimpan:", data);
        
        // Refresh data lokal di menu-save-slot.js
        if (typeof loadAllSlotsFromDatabase === "function") {
            loadAllSlotsFromDatabase();
        }

        // Jalankan game!
        isAssetsLoaded = false; 
        gameState = "PLAYING";
    })
    .catch(error => {
        console.error("Error saat mengunci pilihan karakter:", error);
        alert("Gagal terhubung ke database server Spring Boot!");
    });
}