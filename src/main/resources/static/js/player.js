// =========================================================================
// 1. BASE CLASS: CETAKAN DASAR UNTUK SEMUA PLAYER
// =========================================================================
class DynamicPlayer {
    constructor() {
        // Posisi dasar di dalam canvas
        this.x = 100;
        this.y = 190;

        // Ukuran default (Fallback jika kelas anak lupa mendefinisikan)
        this.width = 100;
        this.height = 100;
        this.groundLevel = 200; 

        // Ukuran potongan frame pada spritesheet
        this.spriteWidth = 128;
        this.spriteHeight = 128;

        // Logika Fisika
        this.speed = 8;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.jumpPower = -15;
        this.isGrounded = false;

        this.direction = "RIGHT";
        this.isMoving = false;
        this.animation = "IDLE";
        this.prevAnimation = "IDLE";
        this.jumpFrames = 4;

        this.attack1Frames = 4; // Ditambahkan default value agar aman
        this.attack2Frames = 4;

        this.isAttacking = false;

        // Manajemen Frame & Timer Animasi Default
        this.frameX = 0;
        this.maxFrames = 8;
        this.frameTimer = 0;
        this.frameInterval = 3; 

        // Siapkan objek gambar kosong di memori
        this.imgIdle = new Image();
        this.imgRun = new Image();
        this.imgJump = new Image();
        this.imgAttack1 = new Image();
        this.imgAttack2 = new Image();
    }

    update() {
        this.isMoving = false;

        // Deteksi Input Pergerakan
        if (keysPressed["a"] || keysPressed["arrowleft"]) {
            this.x -= this.speed;
            this.direction = "LEFT";
            this.isMoving = true;
        }
        if (keysPressed["d"] || keysPressed["arrowright"]) {
            this.x += this.speed;
            this.direction = "RIGHT";
            this.isMoving = true;
        }

        // Batas Layar Canvas (Aman karena width sudah terdefinisi)
        const maxMapWidth = 100 * 32; 
        if (this.x < 0) this.x = 0;
        if (this.x > maxMapWidth - (this.width / 4)) { 
            this.x = maxMapWidth - (this.width / 4);
        }

        // Logika Lompat
        if ((keysPressed["w"] || keysPressed[" "] || keysPressed["arrowup"]) && this.isGrounded) {
            this.velocityY = this.jumpPower;
            this.isGrounded = false;
        }

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Logika Batas Tanah Dinamis mengikuti property kelas anak
        if (this.y >= this.groundLevel) {
            this.y = this.groundLevel;
            this.velocityY = 0;
            this.isGrounded = true;
        }else {
            this.isGrounded = false;
        }

        // Input Menyerang
        if (!this.isAttacking && this.isGrounded) {
            if (keysPressed["j"]) {
                this.isAttacking = true;
                this.animation = "ATTACK1";
                this.frameX = 0; // Reset frame ke awal animasi

                // 🔥 Pemicu Tembakan Projektil
                if (this.job === "WIZARD") {
                    this.shoot("magic");
                } else if (this.job === "ARCHER") {
                    this.shoot("arrow");
                }
            } else if (keysPressed["k"]) {
                this.isAttacking = true;
                this.animation = "ATTACK2";
                this.frameX = 0; // Reset frame ke awal animasi

                // 🔥 Pemicu Tembakan Projektil (Tombol K)
                if (this.job === "WIZARD") {
                    this.shoot("magic");
                } else if (this.job === "ARCHER") {
                    this.shoot("arrow");
                }
            }
        }

        // 🛠️ SET STATE ANIMASI UTAMA (Sudah dibersihkan dari redundansi)
        if (!this.isAttacking) {
            if (!this.isGrounded) {
                this.animation = "JUMP";
            } else if (this.isMoving) {
                this.animation = "RUN";
            } else {
                this.animation = "IDLE";
            }
        }
        
        // Reset frame saat animasi berubah
        if (this.animation !== this.prevAnimation) {
            this.frameX = 0;
            this.frameTimer = 0;

            switch (this.animation) {
                case "JUMP":
                    this.maxFrames = this.jumpFrames;
                    break;
                case "ATTACK1":
                    this.maxFrames = this.attack1Frames;
                    break;
                case "ATTACK2":
                    this.maxFrames = this.attack2Frames;
                    break;
                case "RUN":
                    this.maxFrames = this.runFrames || 8;
                    break;
                case "IDLE":
                default:
                    this.maxFrames = this.idleFrames || 8;
                    break;
            }

            this.prevAnimation = this.animation;
        }

        // Ganti bagian hit-box serangan jarak dekat di player.js menjadi seperti ini:

        if (this.isAttacking && (this.animation === "ATTACK1" || this.animation === "ATTACK2")) {
            if (!this.hasHit && typeof enemies !== "undefined") {
                for (let j = 0; j < enemies.length; j++) {
                    let enemy = enemies[j];
                    if (!enemy.isDead) {
                        
                        // 🔥 PERBAIKAN FORMULA HIT-BOX:
                        // Mengingat width Knight = 500, kita ambil jangkauan tebasan dari pusat sprite-nya
                        let attackRange = 200; // Lebar ayunan pedang
                        let attackX = (this.direction === "RIGHT") ? (this.x + this.width * 0.3) : (this.x + this.width * 0.3 - attackRange);

                        // Tambahkan log bantuan untuk melihat pergerakan hit-box di console
                        // console.log(`[DEBUG COLLISION] AttackX: ${attackX}, EnemyX: ${enemy.x}`);

                        // Deteksi tabrakan kotak serang dengan musuh
                        if (attackX < enemy.x + enemy.width &&
                            attackX + attackRange > enemy.x &&
                            Math.abs(this.y - enemy.y) < 200) { // Toleransi tinggi tabrakan
                            
                            console.log("%c💥 [FRONTEND] Musuh terkena hit tebasan pedang!", "color: #ff4757; font-weight: bold;");
                            this.hasHit = true; 
                            
                            if (typeof reportHeroAttack === "function") {
                                reportHeroAttack(this.id || 2, enemy.id, enemy); // Gunakan ID hero dinamis
                            }
                            break;
                        }
                    }
                }
            }
        }

        // Reset flag pembatas saat status menyerang selesai (kembali ke IDLE/RUN)
        if (!this.isAttacking) {
            this.hasHit = false;
        }
    }

    

    draw(ctx) {
        let currentImage = this.imgIdle;

        if (this.animation === "JUMP") currentImage = this.imgJump;
        else if (this.animation === "RUN") currentImage = this.imgRun;
        else if (this.animation === "ATTACK1") currentImage = this.imgAttack1;
        else if (this.animation === "ATTACK2") currentImage = this.imgAttack2;

        if (!currentImage.complete || currentImage.naturalWidth === 0) {
            ctx.fillStyle = "#ff00ff"; 
            ctx.fillRect(this.x - cameraX, this.y, this.width / 3, this.height / 3); // Sesuaikan dengan cameraX saat loading
            
            ctx.fillStyle = "#ffffff";
            ctx.font = "10px sans-serif";
            ctx.fillText("Loading Sprite...", this.x - cameraX, this.y - 10);
            return; 
        }

        let sx = this.frameX * this.spriteWidth;
        let sy = 0;

        // 🔥 PERBAIKAN: Hitung posisi relatif terhadap kamera di layar monitor
        const screenX = this.x - cameraX; 
        const centerX = screenX + this.width / 2;
        const centerY = this.y + this.height / 2;

        if (this.direction === "LEFT") {
            ctx.save();
            ctx.translate(centerX, centerY); // Sekarang menggunakan posisi layar yang benar
            ctx.scale(-1, 1);
            ctx.drawImage(
                currentImage,
                sx, sy, this.spriteWidth, this.spriteHeight,
                -this.width / 2, -this.height / 2, this.width, this.height
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                currentImage,
                sx, sy, this.spriteWidth, this.spriteHeight,
                screenX, this.y, this.width, this.height // Menggunakan screenX agar serasi
            );
        }

        // ====== LOGIKA PERHITUNGAN TIMER FRAME ======
        this.frameTimer++;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;

            if (this.animation === "ATTACK1" || this.animation === "ATTACK2") {
                if (this.frameX < this.maxFrames - 1) {
                    this.frameX++;
                } else {
                    this.isAttacking = false; 
                    this.frameX = 0;
                }
            } else if (this.animation === "JUMP") {
                if (this.frameX < this.maxFrames - 1) {
                    this.frameX++;
                }
            } else {
                this.frameX = (this.frameX + 1) % this.maxFrames;
            }
        }
    }

    shoot(type) {
        let directionMultiplier = (this.direction === "LEFT") ? -1 : 1;
        
        // Atur posisi awal spawn di sekitar area senjata/tangan karakter
        let spawnX = this.x + (this.width / 2) + (30 * directionMultiplier);
        let spawnY = 400; 

        // Pembuatan objek gambar khusus untuk proyektil ini
        let projectileImg = new Image();
        let maxFrames = 4;        // Default jumlah frame animasi proyektil
        let spriteW = 32;         // Default ukuran 1 kotak frame di gambar aslinya
        let spriteH = 32;
        let displaySize = 48;     // Ukuran skala render proyektil di dalam layar game

        if (type === "magic") {
            projectileImg.src = "/assets/player/Wanderer Magican/Charge_2.png";
            maxFrames = 6;       // Ganti sesuai jumlah frame spritesheet sihir Anda
            spriteW = 64;        // Ganti sesuai lebar per frame gambar sihir Anda
            spriteH = 64;
            displaySize = 80;
        } else if (type === "arrow") {
            projectileImg.src = "/assets/player/Huntress 2/Sprites/Arrow/Move.png" // 🛠️ Sesuaikan path file Anda
            maxFrames = 4;       // Ganti sesuai jumlah frame spritesheet panah Anda
            spriteW = 32;        // Ganti sesuai lebar per frame gambar panah Anda
            spriteH = 32;
            displaySize = 40;
        }

        let newProjectile = {
            x: spawnX,
            y: spawnY,
            speedX: 14 * directionMultiplier,
            direction: this.direction,
            type: type,
            img: projectileImg,
            
            // Properti untuk menghandle animasi frame
            frameX: 0,
            maxFrames: maxFrames,
            spriteWidth: spriteW,
            spriteHeight: spriteH,
            width: displaySize,
            height: displaySize,
            frameTimer: 0,
            frameInterval: 4 // Kecepatan pergantian frame animasi peluru
        };

        if (typeof projectiles !== "undefined") {
            projectiles.push(newProjectile);
        }
    }
}

// =========================================================================
// 2. KELAS ANAK: SPESIFIKASI TIAP HERO
// =========================================================================

class WizardPlayer extends DynamicPlayer {
    constructor() {
        super();
        console.log("memuat gambar untuk wizard");
        
        this.imgIdle.src = "/assets/player/Wanderer Magican/Idle.png";
        this.imgRun.src  = "/assets/player/Wanderer Magican/Run.png";
        this.imgJump.src = "/assets/player/Wanderer Magican/Jump.png";
        this.imgAttack1.src = "/assets/player/Wanderer Magican/Attack_1.png";
        this.imgAttack2.src = "/assets/player/Wanderer Magican/Attack_2.png";

        this.width = 300;
        this.height = 300;
        this.groundLevel = 190; 

        this.idleFrames = 8;
        this.runFrames = 8;
        this.jumpFrames = 4; 
        this.attack1Frames = 7;
        this.attack2Frames = 10;

        this.spriteWidth = 128;
        this.spriteHeight = 128;
        this.speed = 7;
        this.frameInterval = 3;
        this.job = "WIZARD";
    }
}

class KnightPlayer extends DynamicPlayer {
    constructor() {
        super();
        console.log("memuat gambar untuk knight");
        
        this.imgIdle.src = "/assets/player/Knight/_Idle.png";
        this.imgRun.src  = "/assets/player/Knight/_Run.png";
        this.imgJump.src = "/assets/player/Knight/_Jump.png";
        this.imgAttack1.src = "/assets/player/Knight/_Attack.png";
        this.imgAttack2.src = "/assets/player/Knight/_Attack2.png";

        this.width = 500;
        this.height = 500;
        this.groundLevel = 190;

        this.idleFrames = 10;
        this.runFrames = 10;
        this.jumpFrames = 3;
        this.attack1Frames = 4;
        this.attack2Frames = 6;

        this.spriteWidth = 120;  
        this.spriteHeight = 120;
        this.speed = 9;         
        this.frameInterval = 3;
        this.job = "KNIGHT";
    }
}

class ArcherPlayer extends DynamicPlayer {
    constructor() {
        super();
        console.log("memuat gambar untuk archer");
        
        this.imgIdle.src = "/assets/player/Huntress 2/Sprites/Character/Idle.png";
        this.imgRun.src  = "/assets/player/Huntress 2/Sprites/Character/Run.png";
        this.imgJump.src = "/assets/player/Huntress 2/Sprites/Character/Jump.png";
        this.imgAttack1.src = "/assets/player/Huntress 2/Sprites/Character/Attack.png";
        this.imgAttack2.src = "/assets/player/Huntress 2/Sprites/Character/Attack.png"; // Fallback jika attack2 tidak ada

        this.width = 500;
        this.height = 500;
        this.groundLevel = 190;

        this.idleFrames = 10;
        this.runFrames = 8;
        this.jumpFrames = 2;
        this.attack1Frames = 4;
        this.attack2Frames = 4;

        this.spriteWidth = 100;
        this.spriteHeight = 100;
        this.speed = 8;
        this.jumpPower = -17;   
        this.frameInterval = 5;
        this.job = "ARCHER";
    }
}



// =========================================================================
// 3. VARIABEL STATE UTAMA EXPORT LOGIC
// =========================================================================
let hero = null; 

function updatePlayerLogic() {
    if (hero) hero.update();
}
function drawPlayer(ctx) {
    if (hero) hero.draw(ctx);
}