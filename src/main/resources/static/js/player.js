// =========================================================================
// 1. BASE CLASS: CETAKAN DASAR UNTUK SEMUA PLAYER
// =========================================================================
class DynamicPlayer {
    constructor() {
        // Posisi dasar di dalam canvas
        this.x = 100;
        this.y = 190;

        // Ukuran potongan frame pada spritesheet (default)
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

        this.attack1frame = 0;
        this.attack2frame = 0;

        this.isAttacking = false;

        // Siapkan objek gambar kosong di memori
        this.imgIdle = new Image();
        this.imgRun = new Image();
        this.imgJump = new Image();
        this.imgAttack1 = new Image();
        this.imgAttack2 = new Image();
    }

    update() {
        if (this.isAttacking) {
            this.isMoving = false;
        }else {
            this.isMoving = false;
        }

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

        // Batas Layar Canvas
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.width / 3) this.x = canvas.width - this.width / 3;

        // Logika Lompat
        if ((keysPressed["w"] || keysPressed[" "] || keysPressed["arrowup"]) && this.isGrounded) {
            this.velocityY = this.jumpPower;
            this.isGrounded = false;
        }

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        const groundLevel = 200; // Level tanah tetap untuk semua karakter
        if (this.y >= groundLevel) {
            this.y = groundLevel;
            this.velocityY = 0;
            this.isGrounded = true;
        }

        if(!this.isAttacking && this.isGrounded) {
            if (keysPressed["j"]) {
                this.isAttacking = true;
                this.animation = "ATTACK1";
            }else if(keysPressed["k"]) {
                this.isAttacking = true;
                this.animation = "ATTACK2";
            }
        }

        // Set State Animasi
        if (!this.isGrounded) {
            this.animation = "JUMP";
        } else if (this.isMoving) {
            this.animation = "RUN";
        } else {
            this.animation = "IDLE";
        }

        // 🛠️ SET STATE ANIMASI UTAMA
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

            // Membaca jumlah frame secara aman berdasarkan state animasi aktif
            switch (this.animation) {
                case "JUMP":
                    this.maxFrames = this.jumpFrames || 4;
                    break;
                case "ATTACK1":
                    this.maxFrames = this.attack1Frames || 4;
                    break;
                case "ATTACK2":
                    this.maxFrames = this.attack2Frames || 4;
                    break;
                case "RUN":
                    this.maxFrames = this.runFrames || this.animationMaxFrames || 8;
                    break;
                case "IDLE":
                default:
                    this.maxFrames = this.idleFrames || this.animationMaxFrames || 8;
                    break;
            }

            this.prevAnimation = this.animation;
        }
    }

    draw(ctx) {
        let currentImage = this.imgIdle;

        if (this.animation === "JUMP") currentImage = this.imgJump;
        else if (this.animation === "RUN") currentImage = this.imgRun;
        else if (this.animation === "ATTACK1") currentImage = this.imgAttack1;
        else if (this.animation === "ATTACK2") currentImage = this.imgAttack2;

        if (!currentImage.complete || currentImage.naturalWidth === 0) {
            ctx.fillStyle = "#ff00ff"; // Warna magenta terang sebagai penanda
            ctx.fillRect(this.x, this.y, this.width / 3, this.height / 3);
            
            ctx.fillStyle = "#ffffff";
            ctx.font = "10px sans-serif";
            ctx.fillText("Loading Sprite...", this.x, this.y - 10);
            return; 
        }

        let sx = this.frameX * this.spriteWidth;
        let sy = 0;

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        if (this.direction === "LEFT") {
            ctx.save();
            ctx.translate(centerX, centerY);
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
                this.x, this.y, this.width, this.height
            );
        }

        // ====== LOGIKA PERHITUNGAN TIMER FRAME ======
        this.frameTimer++;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;

            if (this.animation === "ATTACK1" || this.animation === "ATTACK2") {
                // Selesaikan animasi serang sampai ujung frame, lalu kunci dicabut (isAttacking = false)
                if (this.frameX < this.maxFrames - 1) {
                    this.frameX++;
                } else {
                    this.isAttacking = false; // Kembalikan kendali ke player
                    this.frameX = 0;
                }
            } else if (this.animation === "JUMP") {
                if (this.frameX < this.maxFrames - 1) {
                    this.frameX++;
                }
            } else {
                // Loop normal untuk RUN dan IDLE
                this.frameX = (this.frameX + 1) % this.maxFrames;
            }
        }
    }
}

// =========================================================================
// 2. KELAS ANAK: DI SINI TEMPAT MENYUNTIKKAN PATH YANG BERBEDA TOTAL
// =========================================================================

class WizardPlayer extends DynamicPlayer {
    constructor() {
        super();
        console.log ("memuat gambar untuk wizard") // Panggil konstruktor utama di atas
        
        // Path Aset Wizard (Contoh: Menggunakan sub-folder bawaan)
        this.imgIdle.src = "/assets/player/Wanderer Magican/Idle.png";
        this.imgRun.src  = "/assets/player/Wanderer Magican/Run.png";
        this.imgJump.src = "/assets/player/Wanderer Magican/Jump.png";

        this.imgAttack1.src = "/assets/player/Wanderer Magican/Attack_1.png";
        this.imgAttack2.src = "/assets/player/Wanderer Magican/Attack_2.png";

        // Anda juga bisa menyesuaikan ukuran jika spritesheet-nya memiliki resolusi berbeda
        this.width = 300;
        this.height = 300;
        
        this.groundLevel = 190; 

        // Manajemen Frame Animasi
        this.frameX = 0;
        this.maxFrames = 8;
        this.frameTimer = 0;
        this.frameInterval = 8;

        this.spriteWidth = 128;
        this.spriteHeight = 128;
        this.speed = 7;
        this.jumpFrames = 4; 
    }
}

class KnightPlayer extends DynamicPlayer {
    constructor() {
        super();
        console.log ("memuat gambar untuk knight") // Panggil konstruktor utama di atas
        
        // Path Aset Knight (Misalnya nama filenya berbeda / lowercase / tanpa subfolder panjang)
        this.imgIdle.src = "/assets/player/Knight/_Idle.png";
        this.imgRun.src  = "/assets/player/Knight/_Run.png";
        this.imgJump.src = "/assets/player/Knight/_Jump.png";

        this.imgAttack1.src = "/assets/player/Knight/_Attack.png";
        this.imgAttack2.src = "/assets/player/Knight/_Attack2.png";

        
        // Sesuaikan spesifikasi spritesheet bawaan aset Knight Anda
        this.width = 500;
        this.height = 500;
        
        this.groundLevel = 190;

        // Manajemen Frame Animasi
        this.frameX = 0;
        this.maxFrames = 10;
        this.frameTimer = 0;
        this.frameInterval = 10;

        this.spriteWidth = 120;  // Misal aset Knight berukuran 128x128 piksel
        this.spriteHeight = 120;
        this.speed = 9;         
        this.jumpFrames = 3;    // Misal frame melompatnya ada 6 baris
    }
}

class ArcherPlayer extends DynamicPlayer {
    constructor() {
        super();
        console.log ("memuat gambar untuk archer") // Panggil konstruktor utama di atas
        
        // Path Aset Archer (Misalnya foldernya menggunakan struktur custom lain)
        this.imgIdle.src = "/assets/player/Huntress 2/Sprites/Character/Idle.png";
        this.imgRun.src  = "/assets/player/Huntress 2/Sprites/Character/Run.png";
        this.imgJump.src = "/assets/player/Huntress 2/Sprites/Character/Jump.png";

        this.imgAttack1.src = "/assets/player/Huntress 2/Sprites/Character/Attack.png";

        // Sesuaikan spesifikasi spritesheet bawaan aset Knight Anda
        this.width = 500;
        this.height = 500;

        this.groundLevel = 190;

        // Manajemen Frame Animasi
        this.frameX = 0;
        this.maxFrames = 10;
        this.frameTimer = 0;
        this.frameInterval = 10;

        this.spriteWidth = 100;
        this.spriteHeight = 100;
        this.speed = 8;
        this.jumpPower = -17;   // Archer melompat lebih tinggi
        this.jumpFrames = 3;
    }
}

// =========================================================================
// 3. VARIABEL STATE UTAMA & INPUT HANDLER
// =========================================================================
let hero = null; 
let isAssetsLoadedFlag = false; 

const keysPressed = {};
window.addEventListener("keydown", (e) => { keysPressed[e.key.toLowerCase()] = true; });
window.addEventListener("keyup", (e) => { delete keysPressed[e.key.toLowerCase()]; });

function updatePlayerLogic() {
    if (hero) hero.update();
}
function drawPlayer(ctx) {
    if (hero) hero.draw(ctx);
}