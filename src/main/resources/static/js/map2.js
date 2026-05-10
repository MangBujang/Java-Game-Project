const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');



// --- KONFIGURASI DATA ---
let isBattleActive = false;
let currentHeroData = null;
let activeMonster = null;
let monsterOnMap = { x: 1200, y: 0, width: 80, height: 80, active: true };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const assetPaths = {
    sky: 'assets/map_tiles/Battleground1/Bright/sky.png',
    ruins_bg: 'assets/map_tiles/Battleground1/Bright/ruins_bg.png',
    hills: 'assets/map_tiles/Battleground1/Bright/hills&trees.png',
    ruins2: 'assets/map_tiles/Battleground1/Bright/ruins2.png',
    ruins: 'assets/map_tiles/Battleground1/Bright/ruins.png',
    ground: 'assets/map_tiles/Battleground1/Bright/stones&grass.png',
    statue: 'assets/map_tiles/Battleground1/Bright/statue.png',

    player_idle: 'assets/player/Wanderer Magican/Idle.png',
    player_run: 'assets/player/Wanderer Magican/Run.png',
    player_jump: 'assets/player/Wanderer Magican/Jump.png',

    fire_dragon_fly: 'assets/dragons/fly_fire_dragon.png',

    monster_skeleton_idle: 'assets/monster/Skeleton/Idle.png',
    monster_skeleton_attack: 'assets/monster/Skeleton/Attack_1.png',
    monster_skeleton_attack2: 'assets/monster/Skeleton/Attack_2.png',
    monster_skeleton_attack3: 'assets/monster/Skeleton/Attack_3.png',
    monster_skeleton_dead: 'assets/monster/Skeleton/Dead.png',
    monster_skeleton_hurt: 'assets/monster/Skeleton/Hurt.png',
    monster_skeleton_spesialatk: 'assets/monster/Skeleton/Special_attack.png'


};

const images = {};
let loadedImages = 0;
const totalImages = Object.keys(assetPaths).length;

function loadAssets() {
    for (let key in assetPaths) {
        const img = new Image();
        img.src = assetPaths[key];
        img.onload = () => {
            images[key] = img;
            loadedImages++;
            if (loadedImages === totalImages) requestAnimationFrame(gameLoop);
        };
    }
}

// --- LOGIKA API ---
function fetchHero() {
    fetch('/api/setup/current-hero')
        .then(res => res.json())
        .then(data => {
            if (data) {
                currentHeroData = data;
                currentHeroData.maxHp = 100;
                currentHeroData.currentHp = 100;
                currentHeroData.attack = 30;
                currentHeroData.defense = 10;
                document.getElementById('display-name').innerText = `Petualang: ${data.name}`;
            }
        });
}

// --- ENTITY GAME ---
const layers = [
    { img: 'sky', speed: 0, x: 0 },
    { img: 'ruins_bg', speed: 0.2, x: 0 },
    { img: 'hills', speed: 0.4, x: 0 },
    { img: 'ruins2', speed: 0.6, x: 0 },
    { img: 'ruins', speed: 0.8, x: 0 },
    { img: 'ground', speed: 2.0, x: 0 }
];

const player = {
    x: 150, y: 0, width: 128, height: 128, speed: 5,
    currentAction: 'player_idle', frameX: 0, maxFrames: 8,
    frameTimer: 0, frameInterval: 100, velocityY: 0,
    jumpForce: -18, gravity: 0.8, isGrounded: false, facingRight: true
};

const pet = {
    x: 0, y: 0, width: 120, height: 120, frameX: 0,
    maxFrames: 4, frameTimer: 0, frameInterval: 120,
    floatOffset: 0, offsetX: -50, offsetY: -90
};

const enemy = {
    x: canvas.width * 0.8,          // Letakkan di sebelah kanan (area kotak merah)
    y: 120,            // Akan dihitung di update berdasarkan groundLimit
    width: 128,      // Sesuaikan dengan ukuran sprite musuh
    height: 128,
    frameX: 0,
    maxFrames: 4,    // Sesuaikan jumlah frame animasi idle musuh
    frameTimer: 0,
    frameInterval: 150
}

let statueX = 900;
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);


// --- UPDATE LOOP ---
function update(dt) {
    if (isBattleActive) return; // Hentikan gerakan jika sedang battle

    let isMoving = false;
    let moveDirection = 0;

    if (keys['KeyD'] || keys['ArrowRight']) { moveDirection = 1; isMoving = true; player.facingRight = true; }
    else if (keys['KeyA'] || keys['ArrowLeft']) { moveDirection = -1; isMoving = true; player.facingRight = false; }

    // Animasi State
    if (!player.isGrounded) player.currentAction = 'player_jump';
    else if (isMoving) player.currentAction = 'player_run';
    else player.currentAction = 'player_idle';

    // Bergerak dan Parallax
    const currentSpeed = moveDirection * player.speed;
    layers.forEach(layer => {
        layer.x -= currentSpeed * layer.speed;
        if (layer.x <= -canvas.width) layer.x = 0;
        if (layer.x > 0) layer.x = -canvas.width;
    });

    statueX -= currentSpeed * 0.8;
    monsterOnMap.x -= currentSpeed * 2.0; // Monster menempel di layer ground

    
    // Jump & Gravity
    if ((keys['Space'] || keys['KeyW']) && player.isGrounded) {
        player.velocityY = player.jumpForce;
        player.isGrounded = false;
    }
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    const groundLimit = canvas.height * 0.70;
    if (player.y > groundLimit - player.height) {
        player.y = groundLimit - player.height;
        player.velocityY = 0;
        player.isGrounded = true;
    }

    // Pet Follow
    const targetX = player.facingRight ? player.x + pet.offsetX : player.x + player.width - pet.offsetX - pet.width;
    pet.x = targetX;
    pet.floatOffset = Math.sin(Date.now() / 300) * 10;
    pet.y = player.y + pet.offsetY + pet.floatOffset;

    // Animasi Frames
    player.frameTimer += dt;
    if (player.frameTimer > player.frameInterval) {
        player.frameX = (player.frameX + 1) % player.maxFrames;
        player.frameTimer = 0;
    }

    enemy.frameTimer += dt;
    if (enemy.frameTimer > enemy.frameInterval) {
        enemy.frameX = (enemy.frameX + 1) % enemy.maxFrames;
        enemy.frameTimer = 0;
    }

    // --- COLLISION DETECTION ---
    if (monsterOnMap.active && player.x + player.width > monsterOnMap.x && player.x < monsterOnMap.x + 50) {
        if (Math.abs(player.y - (groundLimit - 100)) < 100) {
            triggerBattle();
        }
    }

    
}


// --- BATTLE SYSTEM ---
function triggerBattle() {
    isBattleActive = true;
    fetch('/api/monsters/random')
        .then(res => res.json())
        .then(monster => {
            activeMonster = monster;
            activeMonster.currentHp = monster.health;
            
            document.getElementById('m-name').innerText = monster.name;
            document.getElementById('p-name').innerText = currentHeroData.name;
            document.getElementById('battle-screen').style.display = 'flex';
            document.getElementById('battle-log').innerText = "Monster menghadang!";
            updateBattleUI();
        });
}

function updateBattleUI() {
    const mP = (activeMonster.currentHp / activeMonster.health) * 100;
    const pP = (currentHeroData.currentHp / currentHeroData.maxHp) * 100;
    
    document.getElementById('m-hp-fill').style.width = mP + "%";
    document.getElementById('p-hp-fill').style.width = pP + "%";
    document.getElementById('m-hp-text').innerText = `${activeMonster.currentHp}/${activeMonster.health}`;
    document.getElementById('p-hp-text').innerText = `${currentHeroData.currentHp}/${currentHeroData.maxHp}`;
}

function performAttack() {
    const dmgToMonster = Math.max(5, currentHeroData.attack - (activeMonster.defense / 2));
    activeMonster.currentHp -= Math.floor(dmgToMonster);
    document.getElementById('battle-log').innerText = `Kamu menyerang ${activeMonster.name} sebesar ${Math.floor(dmgToMonster)} DMG!`;
    updateBattleUI();

    if (activeMonster.currentHp <= 0) {
        alert("Menang! Monster dikalahkan.");
        endBattle();
    } else {
        setTimeout(monsterCounter, 1000);
    }
}

function monsterCounter() {
    const dmgToPlayer = Math.max(3, activeMonster.attack - (currentHeroData.defense / 2));
    currentHeroData.currentHp -= Math.floor(dmgToPlayer);
    document.getElementById('battle-log').innerText = `${activeMonster.name} menyerang balik sebesar ${Math.floor(dmgToPlayer)} DMG!`;
    updateBattleUI();

    if (currentHeroData.currentHp <= 0) {
        alert("Kamu kalah...");
        location.reload();
    }
}

function endBattle() {
    isBattleActive = false;
    monsterOnMap.active = false;
    document.getElementById('battle-screen').style.display = 'none';
    // Respawn monster di depan sana
    setTimeout(() => {
        monsterOnMap.x = player.x + 1000;
        monsterOnMap.active = true;
    }, 3000);
}

function attemptEscape() {
    if (Math.random() > 0.5) {
        alert("Berhasil lari!");
        endBattle();
    } else {
        document.getElementById('battle-log').innerText = "Gagal lari!";
        setTimeout(monsterCounter, 800);
    }
}

let comboCount = 0;
function useSkill(skillName, baseDmg) {
    if (!isBattleActive) return;

    // Logika Combo: Semakin sering menyerang, damage meningkat
    comboCount++;
    const dmgBoost = 1 + (comboCount * 0.05); // Bonus 5% per combo
    const finalDmg = Math.floor(baseDmg * dmgBoost);

    activeMonster.currentHp -= finalDmg;
    
    // Update UI Combo
    document.getElementById('combo-count').innerText = comboCount;
    document.getElementById('dmg-boost').innerText = Math.round(dmgBoost * 100);
    document.getElementById('battle-log').innerText = `Menggunakan ${skillName}! Damage: ${finalDmg}`;

    updateBattleUI();

    if (activeMonster.currentHp <= 0) {
        setTimeout(() => { alert("Victory!"); endBattle(); }, 500);
    } else {
        // Giliran Monster setelah jeda
        setTimeout(monsterCounter, 1000);
    }
}

// Reset combo jika lari atau battle selesai
function endBattle() {
    isBattleActive = false;
    comboCount = 0; // Reset combo
    document.getElementById('battle-screen').style.display = 'none';
    monsterOnMap.active = false;
}

// --- DRAW LOOP ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach(layer => {
        const img = images[layer.img];
        if (img) {
            ctx.drawImage(img, layer.x, 0, canvas.width, canvas.height);
            if (layer.speed > 0) ctx.drawImage(img, layer.x + canvas.width, 0, canvas.width, canvas.height);
        }

        // Draw Statue
        if (layer.img === 'ruins' && images['statue']) {
            const sHeight = canvas.height * 1.1; 
            const sWidth = sHeight * 1.7; 
            ctx.drawImage(images['statue'], statueX, canvas.height - (sHeight * 0.93), sWidth, sHeight);
        }
    });

    // Draw Monster (Kotak Merah sebagai placeholder)
    const enemySprite = images['monster_skeleton_idle'];
    if (enemySprite && enemySprite.complete) {
        ctx.drawImage(
            enemySprite,
            enemy.frameX * enemy.width, 0, enemy.width, enemy.height, // Source
            enemy.x, enemy.y, enemy.width, enemy.height             // Destination
        );
    }

    // Draw Player
    const sprite = images[player.currentAction];
    if (sprite) {
        ctx.save();
        if (!player.facingRight) {
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, player.frameX * 128, 0, 128, 128, -(player.x + 128), player.y, 128, 128);
        } else {
            ctx.drawImage(sprite, player.frameX * 128, 0, 128, 128, player.x, player.y, 128, 128);
        }
        ctx.restore();
    }

    // Draw Pet
    const petSprite = images['fire_dragon_fly'];
    if (petSprite) {
        ctx.save();
        if (!player.facingRight) {
            ctx.scale(-1, 1);
            ctx.drawImage(petSprite, (Date.now()/120 % 4 | 0) * 120, 0, 120, 120, -(pet.x + 120), pet.y, 120, 120);
        } else {
            ctx.drawImage(petSprite, (Date.now()/120 % 4 | 0) * 120, 0, 120, 120, pet.x, pet.y, 120, 120);
        }
        ctx.restore();
    }

    if (currentHeroData) {
        // Posisi Y dikurangi agar melayang di atas kepala
        const playerBarY = player.y - 20; 
        
        // Bar HP (Hijau)
        drawStatusBar(player.x + 64, playerBarY, currentHeroData.currentHp, 100, "#2ecc71");
        
        // Bar Mana/Defense di atasnya lagi (Biru)
        drawStatusBar(player.x + 64, playerBarY - 12, 80, 100, "#3498db", "🛡️");
    }

    if (monsterOnMap.active && activeMonster) {
        const monsterBarY = canvas.height * 0.70 - 100;
        
        // Bar HP Monster (Merah)
        drawStatusBar(monsterOnMap.x + 30, monsterBarY, activeMonster.currentHp, activeMonster.health, "#e74c3c");
    }
}

let lastTime = 0;
function gameLoop(timeStamp = 0) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    update(isNaN(deltaTime) ? 0 : deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}

/**
 * Menggambar status bar (HP, Mana, dll.)
 * @param {number} x - Posisi X
 * @param {number} y - Posisi Y
 * @param {number} current - Nilai saat ini
 * @param {number} max - Nilai maksimal
 * @param {string} color - Warna isi bar
 * @param {string} label - Label untuk teks
 */
function drawStatusBar(x, y, current, max, color, label = "") {
    const width = 80;  // Lebar total bar
    const height = 8;  // Tinggi bar
    const padding = 2;
    
    // 1. Gambar Background/Bingkai Hitam
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(x - width / 2, y, width, height);

    // 2. Hitung Persentase Isi
    const fillWidth = (current / max) * width;
    
    // 3. Gambar Isi Bar
    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, y, fillWidth, height);
    
    // 4. Tambahkan Efek Border Pixel (Garis Luar)
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width / 2, y, width, height);

    // 5. Jika ada Label atau Icon Defense/Mana (seperti di gambar referensi)
    if (label) {
        ctx.fillStyle = "white";
        ctx.font = "bold 10px Arial";
        ctx.fillText(label, (x - width / 2) - 15, y + height);
    }
}



fetchHero();
loadAssets();