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
function saveCharacterName() {
    if (playerCharacter.name.trim() !== "") {
        // Simpan objek playerCharacter ke LocalStorage berdasarkan slot yang aktif saat ini
        localStorage.setItem(
            `dragon_monster_slot_${currentSaveSlot}`, 
            JSON.stringify(playerCharacter)
        );
        console.log(`Data nama berhasil disimpan di Slot ${currentSaveSlot}!`);
        
        // Pindah ke layar berikutnya (Pilih Naga)
        gameState = "SELECT_DRAGON";
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
        if (typedName.trim()!== "") {
            playerCharacter.name = typedName.trim();
            saveNewSlotToDatabase(currentSaveSlot, playerCharacter.name); // Simpan ke database H2
        }else {
            alert("Nama tidak boleh kosong!");
        } // Panggil fungsi simpan saat menekan Enter
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