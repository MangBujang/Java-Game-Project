// ====== 1. KONFIGURASI PANEL MENU UTAMA ======
const menuPanel = {
    x: 0,          // Dihitung otomatis agar di tengah
    y: 0,          // Dihitung otomatis agar di tengah
    width: 360,    // Diperlebar sedikit agar muat font pixel yang cenderung lebar
    height: 300,   // Tinggi kotak menu
    backgroundColor: "#2a2f35", // Abu-abu gelap khas UI Game Retro
    borderColor: "#57606f",     // Warna border luar
    borderWidth: 6,
    
    // Daftar tombol menu awal
    buttons: [
        { text: "NEW GAME", yOffset: 80, isHovered: false },
        { text: "CONTINUE", yOffset: 130, isHovered: false },
        { text: "CREDITS", yOffset: 180, isHovered: false },
        { text: "EXIT", yOffset: 230, isHovered: false }
    ],
    buttonWidth: 280,
    buttonHeight: 35
};

// ====== 2. FUNGSI UNTUK MENGGAMBAR PANEL ======
function drawMenuPanel(ctx, canvasWidth, canvasHeight) {
    // Hitung posisi tengah layar otomatis berdasarkan ukuran canvas saat ini
    menuPanel.x = (canvasWidth - menuPanel.width) / 2;
    menuPanel.y = (canvasHeight - menuPanel.height) / 2;

    // --- A. Gambar Kotak Utama (Background Panel) ---
    ctx.fillStyle = menuPanel.backgroundColor;
    ctx.fillRect(menuPanel.x, menuPanel.y, menuPanel.width, menuPanel.height);

    // --- B. Gambar Garis Pinggir (Border Panel) ---
    ctx.strokeStyle = menuPanel.borderColor;
    ctx.lineWidth = menuPanel.borderWidth;
    ctx.strokeRect(menuPanel.x, menuPanel.y, menuPanel.width, menuPanel.height);

    // --- C. Gambar Judul Menu ---
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px 'Press Start 2P'"; // Menggunakan font pixel art
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    // Posisi teks tepat di tengah atas di dalam panel
    ctx.fillText("MAIN MENU", menuPanel.x + (menuPanel.width / 2), menuPanel.y + 25);

    // Garis dekorasi tipis di bawah tulisan "MAIN MENU"
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(menuPanel.x + 20, menuPanel.y + 55);
    ctx.lineTo(menuPanel.x + menuPanel.width - 20, menuPanel.y + 55);
    ctx.stroke();

    // --- D. Gambar Tombol-Tombol Menu ---
    menuPanel.buttons.forEach(button => {
        // Hitung posisi koordinat X dan Y tiap tombol secara dinamis
        const btnX = menuPanel.x + (menuPanel.width - menuPanel.buttonWidth) / 2;
        const btnY = menuPanel.y + button.yOffset;

        // Beri warna berbeda jika tombol sedang di-hover (diarahkan mouse)
        ctx.fillStyle = button.isHovered ? "#4b5563" : "#1e222b"; 
        ctx.fillRect(btnX, btnY, menuPanel.buttonWidth, menuPanel.buttonHeight);
        
        // Border tipis untuk tombol
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(btnX, btnY, menuPanel.buttonWidth, menuPanel.buttonHeight);

        // Tulisan di dalam tombol (Teks Kuning jika di-hover, Putih jika normal)
        ctx.fillStyle = button.isHovered ? "#ffcc00" : "#d1d5db";
        ctx.font = "10px 'Press Start 2P'"; // Font tombol lebih kecil agar proporsional
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // Teks pas di tengah vertikal tombol
        
        ctx.fillText(
            button.text, 
            btnX + (menuPanel.buttonWidth / 2), 
            btnY + (menuPanel.buttonHeight / 2)
        );
    });

    
}

// ====== 3. LOGIKA DETEKSI MOUSE (HOVER & KLIK) ======

// Ambil element canvas khusus untuk file ini
const menuCanvas = document.getElementById("gameCanvas");

function isMouseOverButton(mouseX, mouseY, btnX, btnY, btnWidth, btnHeight) {
    return mouseX >= btnX && mouseX <= btnX + btnWidth &&
           mouseY >= btnY && mouseY <= btnY + btnHeight;
}

// Event Hover
menuCanvas.addEventListener("mousemove", (event) => {
    if (gameState !== "MAIN_MENU") return;

    const rect = menuCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // KODE DEBUGGING: Buka F12 di browser, gerakkan mouse, dan cek apakah koordinat ini muncul
    // console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);

    menuPanel.buttons.forEach(button => {
        const btnX = menuPanel.x + (menuPanel.width - menuPanel.buttonWidth) / 2;
        const btnY = menuPanel.y + button.yOffset;

        if (isMouseOverButton(mouseX, mouseY, btnX, btnY, menuPanel.buttonWidth, menuPanel.buttonHeight)) {
            button.isHovered = true;
        } else {
            button.isHovered = false;
        }
    });
});

// Event Klik
menuCanvas.addEventListener("click", (event) => {
    if (gameState !== "MAIN_MENU") return;

    const rect = menuCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    menuPanel.buttons.forEach(button => {
        const btnX = menuPanel.x + (menuPanel.width - menuPanel.buttonWidth) / 2;
        const btnY = menuPanel.y + button.yOffset;

        if (isMouseOverButton(mouseX, mouseY, btnX, btnY, menuPanel.buttonWidth, menuPanel.buttonHeight)) {
            if (button.text === "NEW GAME") {
                gameState = "SELECT_SLOT"; 
            } else if (button.text === "EXIT") {
                alert("Game Keluar");
            }
        }
    });
});