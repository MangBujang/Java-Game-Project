// ====== 1. INISIALISASI CANVAS GLOBAL & URUTAN SCOPE ======
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

let cameraX = 0;

// Deklarasi Global Input & Flag Asset agar aman diakses antar-file
const keysPressed = {};
let isAssetsLoadedFlag = false; 

// ====== 2. STATE MANAGEMENT ======
let gameState = "MAIN_MENU"; 
let currentSaveSlot = 1;

let playerCharacter = {
    name: "",
    selectedCharacterName: null // Diubah dari 'selectedDragon' agar sinkron dengan game loop
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

// ====== 4. GAME LOOP UTAMA ======
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (gameState) {
        case "MAIN_MENU":
            if (typeof drawMenuPanel === "function") {
                drawMenuPanel(ctx, canvas.width, canvas.height);
            }
            break;
        
        case "SAVE_SLOT_MENU":
            if (typeof drawSaveSlotsScreen === "function") {
                drawSaveSlotsScreen(ctx, canvas.width, canvas.height);
            } else {
                console.warn("drawSaveSlotsScreen function is not defined.");
            }
            break;
            
        case "INPUT_NAME":
            if (typeof drawInputNameScreen === "function") {
                drawInputNameScreen(ctx, canvas.width, canvas.height);
            }
            break;

        case "SELECT_CHARACTER": 
            if (typeof drawCharacterSelectionScreen === "function") {
                drawCharacterSelectionScreen(ctx, canvas.width, canvas.height);
            }
            break;

        case "PLAYING":
            // Inisialisasi Karakter Secara Dinamis berdasarkan pilihan user saat masuk game
            if (!isAssetsLoadedFlag) {
                let choosenClass = "WIZARD";
                if (playerCharacter && playerCharacter.selectedCharacterName) {
                    choosenClass = playerCharacter.selectedCharacterName.toUpperCase().trim();
                }
                
                console.log("[DEBUG MAIN] Mencoba membuat objek untuk kelas:", choosenClass);

                if (choosenClass === "KNIGHT") {
                    hero = new KnightPlayer();
                } else if (choosenClass === "ARCHER") {
                    hero = new ArcherPlayer();
                } else {
                    hero = new WizardPlayer(); 
                }
                
                isAssetsLoadedFlag = true; 
                console.log(`[SPAWN SUCCESS] Objek Player berhasil dibuat:`, hero);
            }

            // Memanggil fungsi logika & render dari player.js secara aman
            if (typeof updatePlayerLogic === "function") updatePlayerLogic();
            if (hero) {
                // Menempatkan hero di tengah layar (asumsi lebar canvas adalah 800)
                cameraX = hero.x - 400; 

                // Batasi kamera agar tidak bergeser melewati batas kiri map (0)
                if (cameraX < 0) cameraX = 0;
            }
            
            if (typeof drawGameMap === "function") {
                drawGameMap(ctx);
            }

            if (typeof drawPlayer === "function") drawPlayer(ctx);
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

// ====== INPUT LISTENER GLOBAL ======
window.addEventListener("keydown", (e) => { 
    keysPressed[e.key.toLowerCase()] = true; 
});

window.addEventListener("keyup", (event) => {
    delete keysPressed[event.key.toLowerCase()];
});

window.onload = () => {
    gameLoop();
};