// ====== 1. KONFIGURASI PANEL MENU UTAMA ======
const menuPanel = {
    x: 0,          
    y: 0,          
    width: 360,    
    height: 300,   
    backgroundColor: "#2a2f35", 
    borderColor: "#57606f",     
    borderWidth: 6,
    
    // Pastikan teksnya seragam menggunakan "LOAD GAME" sesuai visual canvas kamu
    buttons: [
        { text: "NEW GAME", yOffset: 80, isHovered: false },
        { text: "LOAD GAME", yOffset: 130, isHovered: false },
        { text: "CREDITS", yOffset: 180, isHovered: false },
        { text: "EXIT", yOffset: 230, isHovered: false }
    ],
    buttonWidth: 280,
    buttonHeight: 35
};

// Hubungkan indeks seleksi pointer keyboard dengan mouse
let menuSelectedIndex = 0;
const menuCanvas = document.getElementById("gameCanvas");

// ====== 2. FUNGSI UNTUK MENGGAMBAR PANEL ======
function drawMenuPanel(ctx, canvasWidth, canvasHeight) {
    menuPanel.x = (canvasWidth - menuPanel.width) / 2;
    menuPanel.y = (canvasHeight - menuPanel.height) / 2;

    // --- A. Background Panel ---
    ctx.fillStyle = menuPanel.backgroundColor;
    ctx.fillRect(menuPanel.x, menuPanel.y, menuPanel.width, menuPanel.height);

    // --- B. Border Panel ---
    ctx.strokeStyle = menuPanel.borderColor;
    ctx.lineWidth = menuPanel.borderWidth;
    ctx.strokeRect(menuPanel.x, menuPanel.y, menuPanel.width, menuPanel.height);

    // --- C. Judul Menu ---
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px 'Press Start 2P'"; 
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("MAIN MENU", menuPanel.x + (menuPanel.width / 2), menuPanel.y + 25);

    // Garis dekorasi di bawah tulisan "MAIN MENU"
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(menuPanel.x + 20, menuPanel.y + 55);
    ctx.lineTo(menuPanel.x + menuPanel.width - 20, menuPanel.y + 55);
    ctx.stroke();

    // --- D. Gambar Tombol Menu ---
    menuPanel.buttons.forEach((button, index) => {
        const btnX = menuPanel.x + (menuPanel.width - menuPanel.buttonWidth) / 2;
        const btnY = menuPanel.y + button.yOffset;

        // Cek apakah tombol aktif disorot (via mouse hover ATAU index keyboard)
        const isSelected = button.isHovered || (index === menuSelectedIndex);

        ctx.fillStyle = isSelected ? "#4b5563" : "#1e222b"; 
        ctx.fillRect(btnX, btnY, menuPanel.buttonWidth, menuPanel.buttonHeight);
        
        ctx.strokeStyle = isSelected ? "#ffcc00" : "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(btnX, btnY, menuPanel.buttonWidth, menuPanel.buttonHeight);

        ctx.fillStyle = isSelected ? "#ffcc00" : "#d1d5db";
        ctx.font = "10px 'Press Start 2P'"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; 
        
        let textDisplay = button.text;
        if (isSelected) {
            textDisplay = `> ${button.text} <`;
        }

        ctx.fillText(textDisplay, btnX + (menuPanel.buttonWidth / 2), btnY + (menuPanel.buttonHeight / 2));
    });
}

// ====== 3. LOGIKA DETEKSI INTERAKSI ======
function isMouseOverButton(mouseX, mouseY, btnX, btnY, btnWidth, btnHeight) {
    return mouseX >= btnX && mouseX <= btnX + btnWidth &&
           mouseY >= btnY && mouseY <= btnY + btnHeight;
}

// Fungsi Pusat Eksekusi Perubahan State Layar
// ... (Kode konfigurasi panel tetap sama)

function jalankanAksiMenu() {
    const tombolTerpilih = menuPanel.buttons[menuSelectedIndex].text;
    console.log(`[WORKFLOW] Mengaktifkan Menu: ${tombolTerpilih}`);

    if (tombolTerpilih === "NEW GAME" || tombolTerpilih === "LOAD GAME") {
        if (typeof loadAllSlotsFromDatabase === "function") {
            loadAllSlotsFromDatabase();
        }
        gameState = "SAVE_SLOT_MENU"; 
    } 
    else if (tombolTerpilih === "EXIT") {
        alert("Game Keluar");
    }
}

// A. Deteksi Hover Gerakan Mouse
menuCanvas.addEventListener("mousemove", (event) => {
    if (gameState !== "MAIN_MENU") return;
    const rect = menuCanvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const mouseY = ((event.clientY - rect.top) / rect.height) * canvas.height;

    menuPanel.buttons.forEach((button, index) => {
        const btnX = menuPanel.x + (menuPanel.width - menuPanel.buttonWidth) / 2;
        const btnY = menuPanel.y + button.yOffset;

        if (isMouseOverButton(mouseX, mouseY, btnX, btnY, menuPanel.buttonWidth, menuPanel.buttonHeight)) {
            button.isHovered = true;
            menuSelectedIndex = index;
        } else {
            button.isHovered = false;
        }
    });
});

// // B. Deteksi Klik Mouse
// menuCanvas.addEventListener("click", (event) => {
//     if (gameState !== "MAIN_MENU") return;
//     const rect = menuCanvas.getBoundingClientRect();
//     const mouseX = ((event.clientX - rect.left) / rect.width) * canvas.width;
//     const mouseY = ((event.clientY - rect.top) / rect.height) * canvas.height;

//     menuPanel.buttons.forEach(button => {
//         const btnX = menuPanel.x + (menuPanel.width - menuPanel.buttonWidth) / 2;
//         const btnY = menuPanel.y + button.yOffset;

//         if (isMouseOverButton(mouseX, mouseY, btnX, btnY, menuPanel.buttonWidth, menuPanel.buttonHeight)) {
//             if (button.text === "NEW GAME" || button.text === "LOAD GAME") {
//                 if (typeof loadAllSlotsFromDatabase === "function") {
//                     loadAllSlotsFromDatabase();
//                 }
//                 gameState = "SAVE_SLOT_MENU"; 
//                 console.log(`[WORKFLOW] Membuka daftar slot save game untuk: ${button.text}`);
//             } 
//             else if (button.text === "EXIT") {
//                 alert("Game Keluar");
//             }
//         }
//     });
// });

// C. Deteksi Tekanan Tombol Keyboard
window.addEventListener("keydown", (event) => {
    if (gameState !== "MAIN_MENU") return;

    if (event.key === "ArrowDown" || event.key === "s") {
        menuSelectedIndex = (menuSelectedIndex + 1) % menuPanel.buttons.length;
    } 
    else if (event.key === "ArrowUp" || event.key === "w") {
        menuSelectedIndex = (menuSelectedIndex - 1 + menuPanel.buttons.length) % menuPanel.buttons.length;
    } 
    else if (event.key === "Enter") {
        jalankanAksiMenu();
    }
});