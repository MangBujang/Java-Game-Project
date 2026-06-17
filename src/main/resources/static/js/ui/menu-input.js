const inputScreen = {
    x: 0, y: 0,
    width: 400,
    height: 220,
    backgroundColor: "#2a2f35",
    borderColor: "#57606f",
    borderWidth: 6,
    
    btnText: "LANJUT",
    btnX: 0, btnY: 0,
    btnWidth: 160,
    btnHeight: 40,
    btnHovered: false,

    maxChars: 10 
};

function drawInputNameScreen(ctx, canvasWidth, canvasHeight) {
    inputScreen.x = (canvasWidth - inputScreen.width) / 2;
    inputScreen.y = (canvasHeight - inputScreen.height) / 2;

    // --- A. Gambar Kotak Dialog ---
    ctx.fillStyle = inputScreen.backgroundColor;
    ctx.fillRect(inputScreen.x, inputScreen.y, inputScreen.width, inputScreen.height);

    ctx.strokeStyle = inputScreen.borderColor;
    ctx.lineWidth = inputScreen.borderWidth;
    ctx.strokeRect(inputScreen.x, inputScreen.y, inputScreen.width, inputScreen.height);

    // --- B. Gambar Teks Petunjuk ---
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("MASUKKAN NAMAMU:", canvasWidth / 2, inputScreen.y + 35);

    // --- C. Gambar Kotak Isian & Nama Player ---
    let currentName = playerCharacter.name; 
    
    if (Math.floor(Date.now() / 500) % 2 === 0 && currentName.length < inputScreen.maxChars) {
        currentName += "_";
    }

    ctx.fillStyle = "#1e222b";
    ctx.fillRect(canvasWidth / 2 - 150, inputScreen.y + 70, 300, 40);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth / 2 - 150, inputScreen.y + 70, 300, 40);

    ctx.fillStyle = "#ffcc00"; 
    ctx.font = "14px 'Press Start 2P'";
    ctx.textBaseline = "middle";
    ctx.fillText(currentName, canvasWidth / 2, inputScreen.y + 90);

    // --- D. Gambar Tombol LANJUT ---
    inputScreen.btnX = (canvasWidth - inputScreen.btnWidth) / 2;
    inputScreen.btnY = inputScreen.y + 145;

    ctx.fillStyle = inputScreen.btnHovered ? "#4b5563" : "#1e222b";
    ctx.fillRect(inputScreen.btnX, inputScreen.btnY, inputScreen.btnWidth, inputScreen.btnHeight);
    
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(inputScreen.btnX, inputScreen.btnY, inputScreen.btnWidth, inputScreen.btnHeight);

    ctx.fillStyle = inputScreen.btnHovered ? "#ffcc00" : "#ffffff";
    ctx.font = "10px 'Press Start 2P'";
    ctx.fillText(inputScreen.btnText, canvasWidth / 2, inputScreen.btnY + (inputScreen.btnHeight / 2));
}

// ====== 3. FUNGSIONALITAS SAVE DATA ======
function submitCharacterName() {
    // Ambil nama yang sudah diinput oleh user dan bersihkan spasi di ujungnya
    const finalName = playerCharacter.name ? playerCharacter.name.trim() : "";

    if (finalName !== "") {
        // 1. Simpan ke LocalStorage sebagai backup cadangan di browser
        localStorage.setItem(`dragon_monster_slot_${currentSaveSlot}`, JSON.stringify(playerCharacter));
        
        // 2. Siapkan data Payload untuk dikirim ke Tabel SAVE_SLOT Database H2 Spring Boot
        const newSaveData = {
            id: currentSaveSlot,             // Mengunci ID sesuai slot aktif yang dipilih (1, 2, atau 3)
            saveName: finalName,             // Mengisi kolom SAVE_NAME di database H2
            playerLevel: 1,                  // Level dasar karakter baru
            selectedCharacterName: "None"    // 🔥 PERBAIKAN: Menggunakan preferensi Karakter/Hero, bukan naga
        };

        // 3. Tembak & Daftarkan data ke Backend Spring Boot
        fetch("/api/slots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSaveData)
        })
        .then(res => {
            if (!res.ok) throw new Error("Gagal menyimpan data karakter ke database");
            return res.json();
        })
        .then(data => {
            console.log("Karakter sukses didaftarkan di tabel SAVE_SLOT H2:", data);
            
            // 4. Sinkronisasikan data internal agar menu slot ikut ter-refresh dengan nama baru
            if (typeof loadAllSlotsFromDatabase === "function") {
                loadAllSlotsFromDatabase();
            }
            
            // 5. 🔥 PERBAIKAN WORKFLOW: Alihkan gameState langsung ke menu pemilihan KARAKTER
            gameState = "SELECT_CHARACTER"; 
            console.log(`[WORKFLOW] Karakter ${finalName} tersimpan. Berpindah ke layar SELECT_CHARACTER.`);
        })
        .catch(err => {
            console.error("Error sinkronisasi H2:", err);
            alert("Gagal terhubung ke database server Spring Boot! Data belum tersimpan.");
        });

    } else {
        alert("Nama tidak boleh kosong!");
    }
}

// ====== 4. LOGIKA KEYBOARD (INPUT KETIKAN) ======
window.addEventListener("keydown", (event) => {
    if (gameState !== "INPUT_NAME") return;

    if (event.key === "Backspace") {
        playerCharacter.name = playerCharacter.name.slice(0, -1);
    } 
    else if (event.key === "Enter") {
        submitCharacterName(); 
    }
    else if (event.key.length === 1 && playerCharacter.name.length < inputScreen.maxChars) {
        if (/[a-zA-Z0-9 ]/.test(event.key)) {
            playerCharacter.name += event.key.toUpperCase();
        }
    }
});

// ====== 5. LOGIKA MOUSE UNTUK TOMBOL LANJUT ======
canvas.addEventListener("mousemove", (event) => {
    if (gameState !== "INPUT_NAME") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (mouseX >= inputScreen.btnX && mouseX <= inputScreen.btnX + inputScreen.btnWidth &&
        mouseY >= inputScreen.btnY && mouseY <= inputScreen.btnY + inputScreen.btnHeight) {
        inputScreen.btnHovered = true;
    } else {
        inputScreen.btnHovered = false;
    }
});

canvas.addEventListener("click", (event) => {
    if (gameState !== "INPUT_NAME") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (mouseX >= inputScreen.btnX && mouseX <= inputScreen.btnX + inputScreen.btnWidth &&
        mouseY >= inputScreen.btnY && mouseY <= inputScreen.btnY + inputScreen.btnHeight) {
        
        saveCharacterName(); // Panggil fungsi simpan saat tombol diklik
    }
});