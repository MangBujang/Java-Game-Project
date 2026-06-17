// ====== 1. INISIALISASI CANVAS GLOBAL & URUTAN SCOPE ======
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// ====== 2. STATE MANAGEMENT ======
let gameState = "MAIN_MENU"; 
let currentSaveSlot = 1;

let playerCharacter = {
    name: "",
    selectedDragon: null
};

// ====== 3. KONFIGURASI LAYAR SAVE SLOT (FALLBACK) ======
const slotScreen = {
    x: 0, y: 0,
    width: 700,
    height: 380,
    backgroundColor: "#2a2f35", 
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

// ====== 4. FUNGSI CADANGAN UNTUK MENGGAMBAR SLOT ======
function drawSaveSlotScreen(ctx, canvasWidth, canvasHeight) {
    slotScreen.x = (canvasWidth - slotScreen.width) / 2;
    slotScreen.y = (canvasHeight - slotScreen.height) / 2;

    ctx.fillStyle = slotScreen.backgroundColor;
    ctx.fillRect(slotScreen.x, slotScreen.y, slotScreen.width, slotScreen.height);
    ctx.strokeStyle = slotScreen.borderColor;
    ctx.lineWidth = slotScreen.borderWidth;
    ctx.strokeRect(slotScreen.x, slotScreen.y, slotScreen.width, slotScreen.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Select save slot", canvasWidth / 2, slotScreen.y + 25);

    slotScreen.slots.forEach(slot => {
        const sX = slotScreen.x + (slotScreen.width - slotScreen.slotWidth) / 2;
        const sY = slotScreen.y + slot.yOffset;

        ctx.fillStyle = "#1e222b";
        ctx.fillRect(sX, sY, slotScreen.slotWidth, slotScreen.slotHeight);
        ctx.strokeStyle = "#4b5563";
        ctx.lineWidth = 2;
        ctx.strokeRect(sX, sY, slotScreen.slotWidth, slotScreen.slotHeight);

        ctx.fillStyle = "#a1a1aa";
        ctx.font = "14px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Empty Slot", sX + (slotScreen.slotWidth / 2), sY + (slotScreen.slotHeight / 2));
    });
}

// ====== Placeholder fungsi gameplay agar aman ======
function updatePlayerLogic() {}
function drawPlayer(ctx) {}

// ====== 5. GAME LOOP UTAMA ======
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (gameState) {
        case "MAIN_MENU":
            // Memanggil fungsi menggambar dari menu-utama.js
            if (typeof drawMenuPanel === "function") {
                drawMenuPanel(ctx, canvas.width, canvas.height);
            }
            break;
        
        case "SELECT_SLOT":
        case "SAVE_SLOT_MENU":
            if (typeof drawSaveSlotsScreen === "function") {
                drawSaveSlotsScreen(ctx, canvas.width, canvas.height);
            } else {
                drawSaveSlotScreen(ctx, canvas.width, canvas.height);
            }
            break;
            
        case "INPUT_NAME":
            if (typeof drawInputNameScreen === "function") {
                drawInputNameScreen(ctx, canvas.width, canvas.height);
            }
            break;

        case "SELECT_CHARACTER": // 🔥 Menggantikan SELECT_DRAGON
            if (typeof drawCharacterSelectionScreen === "function") {
                drawCharacterSelectionScreen(ctx, canvas.width, canvas.height);
            }
            break;

        case "PLAYING":
            updatePlayerLogic();
            ctx.fillStyle = "#1e222b";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawPlayer(ctx);
            drawGameplayHUD(ctx);
            break;
    }

    requestAnimationFrame(gameLoop);
}

// ====== Fungsi Menggambar HUD ======
function drawGameplayHUD(ctx) {
    ctx.fillStyle = "rgba(30, 34, 43, 0.75)";
    ctx.fillRect(10, 10, 220, 75);
    ctx.strokeStyle = "#57606f";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 220, 75);

    ctx.fillStyle = "#ffcc00";
    ctx.font = "10px 'Press Start 2P'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`HERO: ${playerCharacter.name}`, 20, 22);
}

window.onload = () => {
    gameLoop();
};