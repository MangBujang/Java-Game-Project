// ====== 1. KONFIGURASI LAYAR SAVE SLOT ======

const slotCanvas = document.getElementById("gameCanvas");

const slotScreen = {
    x: 0, y: 0,
    width: 700,    // Kotak dibuat lebar sesuai gambar referensi
    height: 380,
    backgroundColor: "rgba(42, 47, 53, 0.85)", // Sedikit transparan agar background belakang samar terlihat
    borderColor: "#57606f",
    borderWidth: 6,

    // Konsep Grid untuk 3 baris Slot
    slots: [
        { id: 1, yOffset: 70, isHovered: false },
        { id: 2, yOffset: 165, isHovered: false },
        { id: 3, yOffset: 260, isHovered: false }
    ],
    slotWidth: 640,
    slotHeight: 80
};

// ====== 2. FUNGSI UNTUK MENGGAMBAR SLOT ======
function drawSaveSlotScreen(ctx, canvasWidth, canvasHeight) {
    // Hitung posisi tengah boks besar\
    ctx.fillStyle = "#ff0000"; // Merah terang
    ctx.font = "20px Arial";
    ctx.fillText("SISTEM SLOT AKTIF!", 50, 50);
    slotScreen.x = (canvasWidth - slotScreen.width) / 2;
    slotScreen.y = (canvasHeight - slotScreen.height) / 2;

    // --- A. Gambar Container Utama ---
    ctx.fillStyle = slotScreen.backgroundColor;
    ctx.fillRect(slotScreen.x, slotScreen.y, slotScreen.width, slotScreen.height);
    ctx.strokeStyle = slotScreen.borderColor;
    ctx.lineWidth = slotScreen.borderWidth;
    ctx.strokeRect(slotScreen.x, slotScreen.y, slotScreen.width, slotScreen.height);

    // --- B. Gambar Judul Atas ---
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Select save slot", canvasWidth / 2, slotScreen.y + 25);

    // --- C. Gambar 3 Baris Slot ---
    slotScreen.slots.forEach(slot => {
        const sX = slotScreen.x + (slotScreen.width - slotScreen.slotWidth) / 2;
        const sY = slotScreen.y + slot.yOffset;

        // Cek apakah ada data tersimpan di LocalStorage untuk slot ini
        const savedData = localStorage.getItem(`dragon_monster_slot_${slot.id}`);
        let slotText = "Empty";
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            slotText = parsedData.name; // Jika ada data, tampilkan nama karakter
        }

        // Jalankan efek hover (warna abu-abu lebih terang jika ditunjuk mouse)
        ctx.fillStyle = slot.isHovered ? "rgba(90, 105, 130, 0.6)" : "rgba(30, 34, 43, 0.5)";
        ctx.fillRect(sX, sY, slotScreen.slotWidth, slotScreen.slotHeight);

        // Border tiap baris slot
        ctx.strokeStyle = slot.isHovered ? "#ffcc00" : "#4b5563"; // Border kuning emas jika di-hover
        ctx.lineWidth = 2;
        ctx.strokeRect(sX, sY, slotScreen.slotWidth, slotScreen.slotHeight);

        // Render Tulisan di dalam Slot (Kuning jika di-hover, Putih/Abu jika normal)
        ctx.fillStyle = slot.isHovered ? "#ffcc00" : (savedData ? "#ffffff" : "#a1a1aa");
        ctx.font = "14px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(slotText, sX + (slotScreen.slotWidth / 2), sY + (slotScreen.slotHeight / 2));
    });
}

// ====== 3. LOGIKA INTERAKSI MOUSE UTUK SLOT ======
// Deteksi Gerakan Mouse (Hover)
slotCanvas.addEventListener("mousemove", (event) => {
    if (gameState !== "SELECT_SLOT") return;

    const rect = slotCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    slotScreen.slots.forEach(slot => {
        const sX = slotScreen.x + (slotScreen.width - slotScreen.slotWidth) / 2;
        const sY = slotScreen.y + slot.yOffset;

        if (mouseX >= sX && mouseX <= sX + slotScreen.slotWidth &&
            mouseY >= sY && mouseY <= sY + slotScreen.slotHeight) {
            slot.isHovered = true;
        } else {
            slot.isHovered = false;
        }
    });
});

// Deteksi Klik Mouse (Pilih Slot)
slotCanvas.addEventListener("click", (event) => {
    if (gameState !== "SELECT_SLOT") return;

    const rect = slotCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    slotScreen.slots.forEach(slot => {
        const sX = slotScreen.x + (slotScreen.width - slotScreen.slotWidth) / 2;
        const sY = slotScreen.y + slot.yOffset;

        if (mouseX >= sX && mouseX <= sX + slotScreen.slotWidth &&
            mouseY >= sY && mouseY <= sY + slotScreen.slotHeight) {
            
            // Catat slot aktif yang dipilih player
            currentSaveSlot = slot.id; 

            // Cek apakah slot yang dipilih kosong atau sudah ada isinya
            const savedData = localStorage.getItem(`dragon_monster_slot_${slot.id}`);
            
            if (savedData) {
                // Jika ada isinya, langsung load datanya dan lompat ke Gameplay Map!
                const parsedData = JSON.parse(savedData);
                playerCharacter = parsedData;
                gameState = "PLAYING"; 
                console.log(`Load Game Berhasil! Selamat datang kembali, ${playerCharacter.name}`);
            } else {
                // Jika kosong ("Empty"), reset data global dan lanjut bikin nama baru
                playerCharacter.name = "";
                playerCharacter.selectedDragon = null;
                gameState = "INPUT_NAME"; 
            }
        }
    });
});