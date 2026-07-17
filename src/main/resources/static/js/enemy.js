class SimpleEnemy {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = 365;
        
        this.width = 150;        
        this.height = 150;       
        
        this.hp = 100;
        this.maxHp = 100;
        this.isDead = false;

        this.currentState = "IDLE";
        this.frameX = 0;
        this.frameTimer = 0;
        this.frameInterval = 8; // Kecepatan putar animasi

        // Konfigurasi frame yang sudah dipastikan tepat sesuai resource gambar Anda
        this.animations = {
            IDLE: { img: new Image(), maxFrames: 7 },
            WALK: { img: new Image(), maxFrames: 8 },
            HURT: { img: new Image(), maxFrames: 3 },
            DEAD: { img: new Image(), maxFrames: 3 },
            ATTACK: { img: new Image(), maxFrames: 7 },
            SPECIAL: { img: new Image(), maxFrames: 5 }
        };

        this.animations.IDLE.img.src = "/assets/monster/Skeleton/Idle.png";
        this.animations.WALK.img.src = "/assets/monster/Skeleton/Walk.png";
        this.animations.HURT.img.src = "/assets/monster/Skeleton/Hurt.png";
        this.animations.DEAD.img.src = "/assets/monster/Skeleton/Dead.png";
        this.animations.ATTACK.img.src = "/assets/monster/Skeleton/Attack_1.png";
        this.animations.SPECIAL.img.src = "/assets/monster/Skeleton/Special_attack.png";
        
        this.attackCooldown = false;
    }

    // ====== TRIGGER PERUBAHAN STATE ======
    changeState(newState) {
        if (this.currentState === "DEAD") return;
        
        // KUNCI UTAMA: Jika sedang ATTACK atau HURT, jangan izinkan ganti state lain 
        // sampai animasi frame-nya benar-benar mencapai ujung akhir.
        if (this.currentState === "ATTACK" || this.currentState === "HURT") {
            let currentAnim = this.animations[this.currentState];
            if (this.frameX < currentAnim.maxFrames - 1) {
                return; // Tolak perubahan state baru, biarkan animasi selesai dulu
            }
        }

        if (this.currentState === newState) return;

        this.currentState = newState;
        this.frameX = 0; 
        this.frameTimer = 0;
    }

    // ====== UPDATE LOGIKA ======
    update() {
        if (this.isDead && this.currentState !== "DEAD") {
            this.changeState("DEAD");
        }

        if (typeof hero !== "undefined" && hero !== null) {
            // 1. Hitung Jarak Horizontal & Jarak Absolut (Menghilangkan error deklarasi ganda)
            const distanceX = hero.x - this.x; 
            const distance = Math.abs(distanceX);
            const attackRange = 50; 

            // AI hanya berjalan jika musuh hidup dan tidak sedang terkunci animasi menyerang/terluka
            if (!this.isDead && this.currentState !== "HURT" && this.currentState !== "ATTACK") {
                
                // Kondisi A: Musuh sudah sangat dekat dan siap memukul (Attack)
                if (distance < attackRange && Math.abs(this.y - hero.y) < 60) {
                    if (!this.attackCooldown) {
                        this.attackCooldown = true;
                        this.changeState("ATTACK"); // Set state ke ATTACK

                        // Panggil fungsi API untuk mengurangi HP hero di server
                        function enemyAttack(heroId, enemyId) {
                            return fetch("http://localhost:8081/api/combat/enemy-attack", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    heroId: heroId,
                                    enemyId: enemyId
                                })
                            })
                            .then(res => res.json());
                        }
                    } else {
                        // Jika dalam masa cooldown dan masih dekat hero, diam
                        this.changeState("IDLE");
                    }
                } 
                // Kondisi B: Musuh mengejar Hero jika berada di luar jangkauan serang
                else if (distance > attackRange) {
                    this.changeState("WALK");
                    if (distanceX > 0) {
                        this.x += 1.5; // Bergerak ke kanan mengejar hero
                    } else {
                        this.x -= 1.5; // Bergerak ke kiri mengejar hero
                    }
                } 
                // Kondisi C: Di antara ambang batas
                else {
                    this.changeState("IDLE");
                }
            }
        }

        // ====== LOGIKA UPDATE ANIMASI FRAME ======
        let currentAnim = this.animations[this.currentState];
        this.frameTimer++;
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;

            if (this.currentState === "DEAD") {
                if (this.frameX < currentAnim.maxFrames - 1) this.frameX++;
            } 
            else if (this.currentState === "HURT" || this.currentState === "ATTACK") {
                if (this.frameX < currentAnim.maxFrames - 1) {
                    this.frameX++;
                } else {
                    // Paksa lepas kunci dan kembali ke IDLE setelah frame sabetan terakhir selesai
                    this.currentState = "IDLE";
                    this.frameX = 0;
                }
            } 
            else {
                this.frameX = (this.frameX + 1) % currentAnim.maxFrames;
            }
        }
    }

    // ====== GAMBAR SPRITE KE CANVAS ======
    draw(ctx, cameraX) {
        let screenX = this.x - cameraX;
        let currentAnim = this.animations[this.currentState];
        let img = currentAnim.img;

        // Render HP Bar musuh
        if (this.currentState !== "DEAD") {
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(screenX + 35, this.y + 25, this.width - 70, 6);
            ctx.fillStyle = "#ff4757";
            let hpWidth = (this.hp / this.maxHp) * (this.width - 70);
            ctx.fillRect(screenX + 35, this.y + 25, hpWidth, 6);
        }

        if (img.complete && img.naturalWidth !== 0) {
            let spriteWidth = img.naturalWidth / currentAnim.maxFrames;
            let spriteHeight = img.naturalHeight;

            let sourceX = this.frameX * spriteWidth;
            let sourceY = 0;

            // Logika deteksi arah hadap musuh ke player
            let flip = false;
            if (typeof hero !== "undefined" && hero !== null) {
                if (hero.x < this.x) {
                    flip = true; 
                }
            }

            if (flip) {
                ctx.save();
                ctx.translate(screenX + this.width / 2, this.y + this.height / 2);
                ctx.scale(-1, 1); 
                ctx.drawImage(
                    img,
                    sourceX, sourceY, spriteWidth, spriteHeight,
                    -this.width / 2, -this.height / 2, this.width, this.height
                );
                ctx.restore();
            } else {
                ctx.drawImage(
                    img,
                    sourceX, sourceY, spriteWidth, spriteHeight,
                    screenX, this.y, this.width, this.height
                );
            }
        }
    }
}

async function enemyAttack(heroId, enemyId) {
    fetch("http://localhost:8081/api/combat/enemy-attack", {
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
        console.log("💥 Enemy damage:", data.damage);

        hero.hp = data.heroHealth;

        if (data.heroIsDead) {
            hero.changeState("DEAD");
        }
    })
    .catch(err => console.error("Enemy attack error:", err));
}