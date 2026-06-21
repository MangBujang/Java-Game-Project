// ====== 1. KONFIGURASI KARAKTER UTAMA (HERO) ======
const hero = {
    // Posisi awal di tengah-tengah map
    x: 400,
    y: 225,
    
    // Ukuran kotak karakter (bisa disesuaikan dengan ukuran sprite-mu nanti)
    width: 32,
    height: 48,
    
    // Kecepatan berjalan (piksel per frame)
    speed: 4,
    
    // Status arah menghadap (untuk keperluan animasi sprite)
    // "DOWN", "UP", "LEFT", "RIGHT"
    direction: "DOWN",
    isMoving: false
};

// ====== 2. TRACKING INPUT KEYBOARD ======
// Objek untuk mencatat tombol apa saja yang sedang ditekan oleh pemain
const keysPressed = {};

window.addEventListener("keydown", (event) => {
    // Catat tombol menjadi true jika ditekan
    keysPressed[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    // Hapus/set menjadi false jika tombol dilepas
    keysPressed[event.key.toLowerCase()] = false;
});

// ====== 3. LOGIKA UPDATE PERGERAKAN (DIUPDATE TIAP FRAME) ======
function updatePlayerLogic() {
    if (gameState !== "PLAYING") return;

    hero.isMoving = false;

    // Gerak ke Atas (Tombol W atau ArrowUp)
    if (keysPressed["w"] || keysPressed["arrowup"]) {
        hero.y -= hero.speed;
        hero.direction = "UP";
        hero.isMoving = true;
    }
    // Gerak ke Bawah (Tombol S or ArrowDown)
    else if (keysPressed["s"] || keysPressed["arrowdown"]) {
        hero.y += hero.speed;
        hero.direction = "DOWN";
        hero.isMoving = true;
    }

    // Gerak ke Kiri (Tombol A atau ArrowLeft)
    if (keysPressed["a"] || keysPressed["arrowleft"]) {
        hero.x -= hero.speed;
        hero.direction = "LEFT";
        hero.isMoving = true;
    }
    // Gerak ke Kanan (Tombol D atau ArrowRight)
    else if (keysPressed["d"] || keysPressed["arrowright"]) {
        hero.x += hero.speed;
        hero.direction = "RIGHT";
        hero.isMoving = true;
    }

    // --- PENGAMAN: Batasi agar karakter tidak berjalan keluar dari batas layar Canvas ---
    if (hero.x < 0) hero.x = 0;
    if (hero.x > 800 - hero.width) hero.x = 800 - hero.width;
    if (hero.y < 0) hero.y = 0;
    if (hero.y > 450 - hero.height) hero.y = 450 - hero.height;
}

// ====== 4. FUNGSI GAMBAR KARAKTER ======
function drawPlayer(ctx) {
    if (gameState !== "PLAYING") return;

    // Sementara kita gunakan kotak solid dulu untuk representasi karakter utama.
    // Nanti kotak ini tinggal kita ganti menggunakan fungsi ctx.drawImage() jika aset sprite gambarmu sudah siap.
    ctx.fillStyle = "#3498db"; // Warna biru keren untuk Hero
    ctx.fillRect(hero.x, hero.y, hero.width, hero.height);

    // Gambar indikator mata/arah kecil biar kita tahu Hero-mu sedang menghadap mana
    ctx.fillStyle = "#ffffff";
    let eyeX = hero.x + 12;
    let eyeY = hero.y + 10;

    if (hero.direction === "LEFT") eyeX = hero.x + 4;
    if (hero.direction === "RIGHT") eyeX = hero.x + 20;
    if (hero.direction === "UP") eyeY = hero.y + 4;

    ctx.fillRect(eyeX, eyeY, 8, 8);
}