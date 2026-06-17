// ====== 1. INISIALISASI CANVAS GLOBAL ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ====== 2. STATE MANAGEMENT (PENGATUR LAYAR) ======
let gameState = "MAIN_MENU"; 
let currentSaveSlot = 1;

let playerCharacter = {
    name: "",
    selectedDragon: null
};

// ====== 3. KONFIGURASI LAYAR SAVE SLOT ======
const slotScreen = {
    x: 0, y: 0,
    width: 700,
    height: 380,
    backgroundColor: "#2a2f35", // Menggunakan warna solid untuk memastikan kotak digambar
    borderColor: "#57606f",
    borderWidth: 6,

    slots: [
        { id: 1, yOffset: 70, isHovered: false },
        { id: 2, yOffset: 165, isHovered: false },
        { id: 3, yOffset: 260, isHovered: false }
    ],
    slotWidth: 640,
    slotHeight: 80
};

// ====== 4. FUNGSI UNTUK MENGGAMBAR SLOT ======
function drawSaveSlotScreen(ctx, canvasWidth, canvasHeight) {
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

        const savedData = localStorage.getItem(`dragon_monster_slot_${slot.id}`);
        let slotText = "Empty";
        
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            slotText = parsedData.name;
        }

        ctx.fillStyle = slot.isHovered ? "#4b5563" : "#1e222b";
        ctx.fillRect(sX, sY, slotScreen.slotWidth, slotScreen.slotHeight);

        ctx.strokeStyle = slot.isHovered ? "#ffcc00" : "#4b5563";
        ctx.lineWidth = 2;
        ctx.strokeRect(sX, sY, slotScreen.slotWidth, slotScreen.slotHeight);

        ctx.fillStyle = slot.isHovered ? "#ffcc00" : (savedData ? "#ffffff" : "#a1a1aa");
        ctx.font = "14px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(slotText, sX + (slotScreen.slotWidth / 2), sY + (slotScreen.slotHeight / 2));
    });
}

// ====== 5. LOGIKA INTERAKSI MOUSE UNTUK SLOT (Menggunakan 'canvas' global) ======
canvas.addEventListener("mousemove", (event) => {
    if (gameState !== "SELECT_SLOT") return;

    const rect = canvas.getBoundingClientRect();
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

canvas.addEventListener("click", (event) => {
    if (gameState !== "SELECT_SLOT") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    slotScreen.slots.forEach(slot => {
        const sX = slotScreen.x + (slotScreen.width - slotScreen.slotWidth) / 2;
        const sY = slotScreen.y + slot.yOffset;

        if (mouseX >= sX && mouseX <= sX + slotScreen.slotWidth &&
            mouseY >= sY && mouseY <= sY + slotScreen.slotHeight) {
            
            currentSaveSlot = slot.id; 
            const savedData = localStorage.getItem(`dragon_monster_slot_${slot.id}`);
            
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                playerCharacter = parsedData;
                gameState = "PLAYING"; 
            } else {
                playerCharacter.name = "";
                playerCharacter.selectedDragon = null;
                gameState = "INPUT_NAME"; 
            }
        }
    });
});

// ====== 6. GAME LOOP UTAMA ======
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (gameState) {
        case "MAIN_MENU":
            if (typeof drawMenuPanel === "function") {
                drawMenuPanel(ctx, canvas.width, canvas.height);
            }
            break;
        
        case "SELECT_SLOT":
        case "SAVE_SLOT_MENU":
            drawSaveSlotsScreen(ctx, canvas.width, canvas.height);
            break;
            
        case "INPUT_NAME":
            if (typeof drawInputNameScreen === "function") {
                drawInputNameScreen(ctx, canvas.width, canvas.height);
            }
            break;

        case "SELECT_DRAGON":
            if (typeof drawCharacterSelectionScreen === "function") {
                drawCharacterSelectionScreen(ctx, canvas.width, canvas.height);
            }
            break;

        case "PLAYING":
            updatePlayerLogic();

            if (typeof drawMap === "function") {
                drawGameMap(ctx);
            }else{
                ctx.fillStyle = "#1e222b";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }


            drawPlayer(ctx);
            drawGameplayHUD(ctx);
            break;
    }

    requestAnimationFrame(gameLoop);
}

// ====== Fungsi Menggambar HUD pada MAP ======
function drawGameplayHUD(ctx) {
    //--- Box Status ---
    ctx.fillstyle = "rgba(30, 34, 43, 0.75)";
    ctx.fillRect(10, 10, 220, 75);
    ctx.strokeStyle = "#57606f";
    ctx.linewidth = 3;
    ctx.strokeReact(10, 10, 220, 75);

    //--- Nama Pemain ---
    ctx.fillStyle = "#ffcc00";
    ctx.font = "10px 'Press Start 2P'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`HERO: ${playerCharacter.name}`, 20, 22);

    //--- Partner Naga ---
    if (playerCharacter.selectedDragon) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "8px 'Press Start 2P'";
        ctx.fillText(`DRAGON: ${playerCharacter.selectedDragon.name}`, 20, 42);

        // bar HP naga
        ctx.fillStyle = "#747d8c";
        ctx.fillRect(20, 58, 150, 10);
        ctx.fillStyle = "#ff4757";
        ctx.fillRect(20, 58, 150 * (playerCharacter.selectedDragon.hp / 100), 10);

        ctx.fillStyle = "#ffffff";
        ctx.font = "7px 'Press Start 2P'";
        ctx.fillText(`HP: ${playerCharacter.selectedDragon.hp}/100`, 175, 60);
    }
}

// ====== 7. MENJALANKAN GAME ======
window.onload = () => {
    gameLoop();
};