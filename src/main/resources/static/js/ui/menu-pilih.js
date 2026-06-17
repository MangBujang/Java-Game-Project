// ====== 1. DAFTAR CLASS KARAKTER (MANUAL/LOCAL DATA) ======
// Kita definisikan daftar karakter langsung di sini agar tidak bentrok dengan tabel Naga di database
const characterList = [
    {
        id: "wizard",
        name: "Wizard",
        description: "Pengendali elemen sihir",
        health: 80,
        attack: 45,
        defense: 10,
        color: "#3498db" // Warna representasi (Biru)
    },
    {
        id: "knight",
        name: "Knight",
        description: "Pelindung garis depan",
        health: 140,
        attack: 25,
        defense: 35,
        color: "#e74c3c" // Warna representasi (Merah)
    },
    {
        id: "archer",
        name: "Archer",
        description: "Penembak jitu jarak jauh",
        health: 100,
        attack: 40,
        defense: 18,
        color: "#2ecc71" // Warna representasi (Hijau)
    }
];

// ====== 2. KONFIGURASI LAYAR SELEKSI ======
const charScreen = {
    x: 0, y: 0,
    width: 740,
    height: 400,
    backgroundColor: "#1e222b",
    borderColor: "#4b5563",
    borderWidth: 6,

    characters: characterList.map(char => ({ ...char, isHovered: false })),

    // Layout Kartu Karakter
    cardWidth: 150,
    cardHeight: 200,
    cardStartY: 130,
    gap: 15
};

// ====== 3. FUNGSI GAMBAR LAYAR PILIHAN KARAKTER ======
function drawCharacterSelectionScreen(ctx, canvasWidth, canvasHeight) {
    charScreen.x = (canvasWidth - charScreen.width) / 2;
    charScreen.y = (canvasHeight - charScreen.height) / 2;

    // --- A. Gambar Container Utama ---
    ctx.fillStyle = charScreen.backgroundColor;
    ctx.fillRect(charScreen.x, charScreen.y, charScreen.width, charScreen.height);
    ctx.strokeStyle = charScreen.borderColor;
    ctx.lineWidth = charScreen.borderWidth;
    ctx.strokeRect(charScreen.x, charScreen.y, charScreen.width, charScreen.height);

    // --- B. Gambar Judul Menu ---
    ctx.fillStyle = "#ffcc00";
    ctx.font = "14px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("PILIH CLASS KARAKTERMU", canvasWidth / 2, charScreen.y + 25);
    
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "7px 'Press Start 2P'";
    ctx.fillText("Tentukan takdir dan gaya bertarungmu di dunia Dragonworld", canvasWidth / 2, charScreen.y + 55);

    // --- C. Gambar Kartu Karakter (Wizard, Knight, Mage, Archer) ---
    const totalChars = charScreen.characters.length;
    const totalWidth = (totalChars * charScreen.cardWidth) + ((totalChars - 1) * charScreen.gap);
    let startX = (canvasWidth - totalWidth) / 2;

    charScreen.characters.forEach((char, index) => {
        const cX = startX + (index * (charScreen.cardWidth + charScreen.gap));
        const cY = charScreen.y + charScreen.cardStartY;

        // Simpan koordinat render untuk deteksi klik mouse
        char.renderX = cX;
        char.renderY = cY;

        // Background Box Kartu
        ctx.fillStyle = char.isHovered ? "rgba(55, 65, 81, 0.9)" : "rgba(31, 41, 55, 0.6)";
        ctx.fillRect(cX, cY, charScreen.cardWidth, charScreen.cardHeight);

        // Border Kartu (Akan menyala kuning emas jika di-hover)
        ctx.strokeStyle = char.isHovered ? "#ffcc00" : "#4b5563";
        ctx.lineWidth = char.isHovered ? 3 : 2;
        ctx.strokeRect(cX, cY, charScreen.cardWidth, charScreen.cardHeight);

        // Visual Mini Box (Representasi Avatar Karakter Sebelum Ada Sprite Gambar)
        ctx.fillStyle = char.color;
        ctx.fillRect(cX + 15, cY + 15, charScreen.cardWidth - 30, 60);
        
        // Teks Nama Class di Atas Avatar Box jika di-hover
        ctx.fillStyle = "#ffffff";
        ctx.font = "6px 'Press Start 2P'";
        ctx.fillText("[ " + char.name.toUpperCase() + " ]", cX + (charScreen.cardWidth / 2), cY + 42);

        // Nama Class Karakter di bawah Box Visual
        ctx.fillStyle = char.isHovered ? "#ffcc00" : "#ffffff";
        ctx.font = "10px 'Press Start 2P'";
        ctx.fillText(char.name, cX + (charScreen.cardWidth / 2), cY + 95);

        // Deskripsi Singkat Karakter
        ctx.fillStyle = "#9ca3af";
        ctx.font = "5px 'Press Start 2P'";
        ctx.fillText(char.description, cX + (charScreen.cardWidth / 2), cY + 115);

        // Tampilkan Status/Atribut Unik Class Karakter
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = "6px 'Press Start 2P'";
        let statsY = cY + 140;
        
        ctx.fillText(`HP  : ${char.health}`, cX + 20, statsY);
        ctx.fillText(`ATK : ${char.attack}`, cX + 20, statsY + 12);
        ctx.fillText(`DEF : ${char.defense}`, cX + 20, statsY + 24);
        
        // Tanda Interaksi Klik
        if (char.isHovered) {
            ctx.fillStyle = "#2ecc71";
            ctx.font = "5px 'Press Start 2P'";
            ctx.fillText("> KLIK UNTUK MEMILIH", cX + 16, statsY + 42);
        }

        ctx.textAlign = "center"; // Reset alignment
    });
}

// ====== 4. LOGIKA MOUSE (HOVER & SELEKSI KLIK) ======
canvas.addEventListener("mousemove", (event) => {
    if (gameState !== "SELECT_DRAGON") return; // Menjaga state alur transisi dari input nama

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    charScreen.characters.forEach(char => {
        if (char.renderX && mouseX >= char.renderX && mouseX <= char.renderX + charScreen.cardWidth &&
            mouseY >= char.renderY && mouseY <= char.renderY + charScreen.cardHeight) {
            char.isHovered = true;
        } else {
            char.isHovered = false;
        }
    });
});

canvas.addEventListener("click", (event) => {
    if (gameState !== "SELECT_DRAGON") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    charScreen.characters.forEach(char => {
        if (char.renderX && mouseX >= char.renderX && mouseX <= char.renderX + charScreen.cardWidth &&
            mouseY >= char.renderY && mouseY <= char.renderY + charScreen.cardHeight) {
            
            // Masukkan status class pilihan ke dalam data playerCharacter global
            playerCharacter.className = char.name;
            playerCharacter.health = char.health;
            playerCharacter.maxHealth = char.health;
            playerCharacter.attack = char.attack;
            playerCharacter.defense = char.defense;

            // Simpan pembaruan data Hero (Nama + Class Pilihan + Status) ke LocalStorage slot aktif
            localStorage.setItem(`dragon_monster_slot_${currentSaveSlot}`, JSON.stringify(playerCharacter));

            console.log(`Kamu memilih Class ${char.name}! Menyimpan data pemburu...`);
            
            // Alihkan layar langsung masuk ke arena berburu (Gameplay Map)!
            gameState = "PLAYING";
        }
    });
});
