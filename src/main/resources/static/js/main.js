// ====== 1. INISIALISASI CANVAS GLOBAL & URUTAN SCOPE ======
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

let cameraX = 0;

// Deklarasi Global Input & Flag Asset agar aman diakses antar-file
const keysPressed = {};
let isAssetsLoadedFlag = false; 
let projectiles = [];

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

function loadSelectedHeroFromServer(heroName) {
    // Sesuaikan port di bawah ini (8080 atau 8081) dengan port berjalannya Spring Boot Anda
    fetch("http://localhost:8081/api/heroes")
        .then(response => response.json())
        .then(data => {
            let masterData = data.find(h => h.name === heroName);
            
            if (masterData) {
                if (heroName === "KNIGHT") {
                    hero = new KnightPlayer();
                    hero.id = 2;
                } else if (heroName === "WIZARD") {
                    hero = new WizardPlayer();
                    hero.id = 1;
                } else if (heroName === "ARCHER") {
                    hero = new ArcherPlayer();
                    hero.id = 3;
                }
                
                hero.hp = masterData.health;
                hero.maxHp = masterData.maxHealth;
                hero.id = masterData.id;
                console.log(`${heroName} berhasil dimuat dari server dengan HP: ${hero.hp}`);
            }
        })
        .catch(err => {
            console.warn("Gagal mengambil data hero dari server. Mengaktifkan fallback lokal...", err);
            
            // 🔥 SOLUSI CADANGAN: Karakter tetap dibuat secara lokal jika server offline
            if (heroName === "KNIGHT") {
                hero = new KnightPlayer();
            } else if (heroName === "WIZARD") {
                hero = new WizardPlayer();
            } else if (heroName === "ARCHER") {
                hero = new ArcherPlayer();
            }
            
            // Set stats default agar game tetap bisa berjalan selama testing
            if (hero) {
                hero.hp = 100;
                hero.maxHp = 100;
                console.log(`${heroName} berhasil dimuat via Fallback Lokal (Server Offline).`);
            }
        });
}

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
            // 🛠️ INISIALISASI DINAMIS DENGAN FETCH BACKEND
            if (!isAssetsLoadedFlag) {
                let choosenClass = "KNIGHT"; // Default fallback
                if (playerCharacter && playerCharacter.selectedCharacterName) {
                    choosenClass = playerCharacter.selectedCharacterName.toUpperCase().trim();
                }
                
                console.log("[DEBUG MAIN] Memuat data dari server untuk kelas:", choosenClass);

                // 1. Panggil fungsi fetch ke Spring Boot
                loadSelectedHeroFromServer(choosenClass);

                // 2. Tetap spawn musuh seperti biasa
                enemies = [
                    new SimpleEnemy(101, 600, 365), // Y diubah ke 365 agar menapak tanah
                    new SimpleEnemy(102, 900, 365)
                ];

                isAssetsLoadedFlag = true; 
            }

            // Memanggil fungsi logika & render dari player.js secara aman
            if (typeof updatePlayerLogic === "function") updatePlayerLogic();
            
            if (hero) {
                cameraX = hero.x - 320; 
                if (cameraX < 0) cameraX = 0;
            }
            
            const maxCameraX = (100 * 32) - canvas.width;
            if (cameraX > maxCameraX) cameraX = maxCameraX;

            if (typeof drawGameMap === "function") drawGameMap(ctx);

            if (typeof enemies !== "undefined") {
                enemies.forEach(enemy => {
                    // 🔥 Hanya jalankan update musuh JIKA objek hero sudah siap terbentuk di memory
                    if (hero !== null) {
                        enemy.update();
                    }
                    enemy.draw(ctx, cameraX); 
                });
            }

            updateAndDrawProjectiles(ctx);

            if (typeof drawPlayer === "function") drawPlayer(ctx);
            drawGameplayHUD(ctx);

            break;
        }
    

    requestAnimationFrame(gameLoop);
}

// ====== Fungsi Menggambar HUD ======
function drawGameplayHUD(ctx) {
    // Background HUD
    ctx.fillStyle = "rgba(30, 34, 43, 0.85)";
    ctx.fillRect(10, 10, 260, 85);
    ctx.strokeStyle = "#57606f";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 260, 85);

    // Teks Informasi Hero
    ctx.fillStyle = "#ffcc00";
    ctx.font = "Press Start 2P"; // Gunakan font standar jika 'Press Start 2P' belum dimuat
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    // Tampilkan Nama Player
    ctx.fillText(`PLAYER: ${playerCharacter.name}`, 20, 18);

    if (hero) {
        // Tampilkan Level dan Status HP Nyata dari Database
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`LV. ${hero.level || 1}`, 20, 38); // Mengambil level dinamis
        
        // Menggambar teks HP
        ctx.fillStyle = "#ff4757";
        ctx.fillText(`HP: ${hero.hp} / ${hero.maxHp}`, 20, 58); // Mengambil HP dinamis
    }
}

function updateAndDrawProjectiles(ctx) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        
        // 1. Jalankan Pergerakan Posisi
        p.x += p.speedX;

        // 2. Logika Perubahan Frame Animasi Projektil
        p.frameTimer++;
        if (p.frameTimer > p.frameInterval) {
            p.frameTimer = 0;
            p.frameX = (p.frameX + 1) % p.maxFrames;
        }

        // 3. Gambar Animasi ke Canvas (Relatif terhadap kamera)
        if (p.img.complete && p.img.naturalWidth !== 0) {
            let sx = p.frameX * p.spriteWidth;
            let sy = 0;
            
            let screenX = p.x - cameraX;
            let centerX = screenX + p.width / 2;
            let centerY = p.y + p.height / 2;

            if (p.direction === "LEFT") {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.scale(-1, 1);
                ctx.drawImage(p.img, sx, sy, p.spriteWidth, p.spriteHeight, -p.width / 2, -p.height / 2, p.width, p.height);
                ctx.restore();
            } else {
                ctx.drawImage(p.img, sx, sy, p.spriteWidth, p.spriteHeight, screenX, p.y, p.width, p.height);
            }
        }

        // 🔥 4. LOGIKA DETEKSI TABRAKAN BARU (Aman dari ReferenceError)
        if (typeof enemies !== "undefined") {
            for (let j = 0; j < enemies.length; j++) {
                let enemy = enemies[j];

                // Hanya cek musuh yang belum mati
                if (!enemy.isDead) {
                    // Formula dasar tabrakan kotak (AABB Collision)
                    if (p.x < enemy.x + enemy.width && 
                        p.x + p.width > enemy.x && 
                        p.y < enemy.y + enemy.height && 
                        p.y + p.height > enemy.y) {
                        
                        // Kirim data serangan ke server Spring Boot
                        console.log("Hero ID:", hero.id);
                        console.log("Enemy ID:", enemy.id);

                        reportHeroAttack(hero.id, enemy.id, enemy);

                        // Hapus peluru dari array setelah mengenai musuh
                        setTimeout(() => {
                            projectiles.splice(i, 1);
                        }, 50);
                        break; // Keluar dari loop musuh karena peluru ini sudah hancur
                    }
                }
            }
        }

        // 5. Penghapusan Otomatis saat keluar layar monitor
        // Cek kembali index 'i' memastikan peluru belum dihapus oleh tabrakan di atas
        if (projectiles[i] && (p.x - cameraX < -100 || p.x - cameraX > canvas.width + 100)) {
            projectiles.splice(i, 1);
        }
    }
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

const BASE_URL = "http://localhost:8081";

function reportHeroAttack(heroId, enemyId, visualEnemyObject) {
    if (!heroId || !enemyId) {
        console.error("❌ ID tidak valid!", heroId, enemyId);
        return;
    }

    console.log("⚔️ Hero menyerang:", heroId, "->", enemyId);

    // 🔥 efek langsung (biar terasa hit)
    visualEnemyObject.changeState("HURT");
    visualEnemyObject.hp -= 10;

    fetch(`${BASE_URL}/api/combat/hero-attack`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            heroId: heroId,
            enemyId: enemyId
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("✅ Response server:", data);

        // 🔥 sinkron HP dari server
        visualEnemyObject.hp = data.enemyHealth;

        if (data.enemyIsDead) {
            visualEnemyObject.isDead = true;
            visualEnemyObject.changeState("DEAD");
        }
    })
    .catch(err => {
        console.error("❌ Error server:", err);
    });
}

// 🛠️ PERBAIKAN DI MAIN.JS
async function heroAttackEnemy(heroId, enemyId) {
    try {
        const response = await fetch("http://localhost:8081/api/combat/hero-attack", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                heroId: heroId,
                enemyId: enemyId
            })
        });

        // Jika server mengembalikan status error (seperti 400 Bad Request)
        if (!response.ok) {
            const errorText = await response.text(); // Baca sebagai teks biasa, bukan JSON
            console.warn("[WARNER SERVER]:", errorText);
            return { error: true, message: errorText };
        }

        const data = await response.json();
        console.log("Damage:", data.damageDealt);
        return data;

    } catch (error) {
        console.error("Gagal melakukan fetch heroAttackEnemy:", error);
        return { error: true, message: "Koneksi terputus" };
    }
}