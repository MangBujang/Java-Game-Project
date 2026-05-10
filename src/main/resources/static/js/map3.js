const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isBattleActive = false;
let activeMonsterId = null;
let currentHeroId = 1;

// 1. KONFIGURASI DUNIA & LEVEL
const world = {
    width: 4000,       // Panjang total peta
    height: 0,        // Akan diisi saat resize
    groundY: 0.85,    // Batas tanah (85% layar)
    cameraX: 0,
    gravity: 0.8
};

// 2. DEFINISI ASET
const assetPaths = {
    background: 'assets/map_tiles/Battleground2/Bright/bg.png',
    candle: 'assets/map_tiles/Battleground2/Bright/candeliar.png',
    columns: 'assets/map_tiles/Battleground2/Bright/columns&falgs.png',
    statue: 'assets/map_tiles/Battleground2/Bright/dragon.png',
    floor: 'assets/map_tiles/Battleground2/Bright/floor.png',
    mountain: 'assets/map_tiles/Battleground2/Bright/mountaims.png',
    wall: 'assets/map_tiles/Battleground2/Bright/wall@windows.png',


    player_idle: 'assets/player/Wanderer Magican/Idle.png',
    player_run: 'assets/player/Wanderer Magican/Run.png',
    player_jump: 'assets/player/Wanderer Magican/Jump.png',

    pet_dragon: 'assets/dragons/fly_fire_dragon.png',
    enemy_idle: 'assets/monster/Skeleton/Idle.png',
};

const images = {};
let loadedImages = 0;
const totalImages = Object.keys(assetPaths).length;


// 3. OBJEK ENTITAS
const player = {
    x: 150,
    y: 0, 
    width: 128, 
    height: 128,
    speed: 6, 
    velocityY: 0, 
    jumpForce: -18,
    isGrounded: false, 
    facingRight: true, 
    action: 'player_idle',
    frameX: 0, maxFrames: 8, frameTimer: 0, frameInterval: 100
};

const pet = {
    x: 100, 
    y: 0, 
    width: 122, 
    height: 122,
    type: 'FLYING',
    offsetX: -20, 
    offsetY: -40, // Ubah menjadi positif agar naga terbang lebih rendah mendekati player
    frameX: 0, 
    maxFrames: 4, 
    frameTimer: 0, 
    frameInterval: 120
};

const enemy = {
    x: 1500, 
    y: 0, 
    width: 128, // Sesuaikan width dengan ukuran asli satu frame sprite musuh Anda
    height: 128, // Sesuaikan height agar tidak terpotong
    isAlive: true, 
    hp: 100,
    frameX: 0, 
    maxFrames: 4, 
    frameTimer: 0, 
    frameInterval: 150
};

const layers = [
    { name: 'background', speed: 0 },
    { name: 'mountain', speed: 0.1 },
    { name: 'wall', speed: 0.3 },
    { name: 'columns', speed: 1.1 },
    { name: 'candle', speed: 1.1 },
    { name: 'floor', speed: 1.0 },
];

const keys = {};

// 4. SISTEM UTAMA
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    world.height = canvas.height;
}

window.addEventListener('resize', resize);
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

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

// 5. LOGIKA UPDATE
function update(dt) {
    if (isBattleActive) return; // Kunci gerakan jika sedang battle
    console.log("Player X:", Math.floor(player.x), "Enemy X:", enemy.x);

    let moveDir = 0;
    if (keys['KeyD'] || keys['ArrowRight']) moveDir = 1;
    else if (keys['KeyA'] || keys['ArrowLeft']) moveDir = -1;

    if (moveDir !== 0) player.facingRight = moveDir > 0;

    let nextX = player.x + (moveDir * player.speed);

    // Deteksi Tabrakan & Gate
    if (enemy.isAlive) {
        const distanceX = Math.abs(player.x - enemy.x);
        if (distanceX < 150) {
            console.log("BOOM! Battle Start!")
            triggerBattle();
            return;
        }
        if (nextX > enemy.x - 100) nextX = enemy.x - 100;
    }

    if (nextX < 0) nextX = 0;
    if (nextX > world.width - player.width) nextX = world.width - player.width;
    player.x = nextX;

    // Fisika & Grounding
    if ((keys['Space'] || keys['KeyW']) && player.isGrounded) {
        player.velocityY = player.jumpForce;
        player.isGrounded = false;
    }
    player.velocityY += world.gravity;
    player.y += player.velocityY;

    const groundPos = world.height * world.groundY;
    if (player.y + player.height > groundPos) {
        player.y = groundPos - player.height;
        player.velocityY = 0;
        player.isGrounded = true;
    }

    // Kamera & Pet Follow
    world.cameraX += (player.x - canvas.width / 3 - world.cameraX) * 0.1;
    if (world.cameraX < 0) world.cameraX = 0;

    const petTargetX = player.facingRight ? player.x + pet.offsetX : player.x + player.width - pet.offsetX - pet.width;
    pet.x += (petTargetX - pet.x) * 0.1;
    pet.y = player.y + pet.offsetY + Math.sin(Date.now() / 300) * 10;

    // Animasi
    [player, pet, enemy].forEach(ent => {
        ent.frameTimer += dt;
        if (ent.frameTimer > ent.frameInterval) {
            ent.frameX = (ent.frameX + 1) % ent.maxFrames;
            ent.frameTimer = 0;
        }
    });
}

// 6. PROSES DRAWING
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar Parallax Layers
    layers.forEach(layer => {
        const img = images[layer.name];
        if (img) {
            let bgX = -(world.cameraX * layer.speed);
            
            // Khusus untuk aset interior, kita buat loop gambarnya
            for (let i = 0; i < Math.ceil(world.width / canvas.width) + 1; i++) {
                let xPos = bgX + (i * canvas.width);
                
                // Jika layer adalah lantai, tempelkan tepat di bawah
                if (layer.name === 'floor') {
                    // Gambar lantai di posisi bawah sesuai groundY
                    ctx.drawImage(img, xPos, 0, canvas.width, canvas.height);
                } else {
                    ctx.drawImage(img, xPos, 0, canvas.width, canvas.height);
                }
            }
        }
        
        // Letakkan Patung Naga di koordinat tertentu di dunia
        if (layer.name === 'floor' && images['statue']) {
            const dragImg = images['statue'];
            // Sesuaikan koordinat X (misal di 800) dan Y agar menapak di lantai
            ctx.drawImage(dragImg, 800 - world.cameraX, 0, canvas.width, canvas.height);
        }
    });

    // Gambar Enemy
    if (enemy.isAlive && images['enemy_idle']) {
        const eImg = images['enemy_idle'];
        const groundPos = world.height * world.groundY;
        const enemyScreenX = enemy.x - world.cameraX;

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            eImg, 
            enemy.frameX * enemy.width, 0, 
            enemy.width, enemy.height,      
            -(enemyScreenX + enemy.width),  // Posisi X tujuan (negatif karena scale -1)
            groundPos - enemy.height,       // Posisi Y (tetap menapak di lantai)
            enemy.width, enemy.height       
        );
        ctx.restore();
    }

    // Gambar Player
    const pSprite = images[player.isGrounded ? (Math.abs(keys['KeyD'] - keys['KeyA']) ? 'player_run' : 'player_idle') : 'player_jump'];
    if (pSprite) {
        ctx.save();
        if (!player.facingRight) {
            ctx.scale(-1, 1);
            ctx.drawImage(pSprite, player.frameX * player.width, 0, player.width, player.height,
                -(player.x - world.cameraX + player.width), player.y, player.width, player.height);
        } else {
            ctx.drawImage(pSprite, player.frameX * player.width, 0, player.width, player.height,
                player.x - world.cameraX, player.y, player.width, player.height);
        }
        ctx.restore();
    }
    
    const petSprite = images['pet_dragon']; // Default ke unicorn, bisa diubah dengan switchPet
    if (petSprite && petSprite.complete) {
        ctx.save();
        const screenX = pet.x - world.cameraX;
        // Membalik arah naga sesuai arah player
        if (!player.facingRight) {
            ctx.scale(-1, 1);
            ctx.drawImage(petSprite,
                pet.frameX * pet.width, 0, pet.width, pet.height,
                -(screenX + pet.width), pet.y, pet.width, pet.height
            );
        } else {
            ctx.drawImage(petSprite,
                pet.frameX * pet.width, 0, pet.width, pet.height,
                screenX, pet.y, pet.width, pet.height
            );
        }
        ctx.restore();
    }

}

function triggerBattle() {
        isBattleActive = true;
        document.getElementById('battle-screen').style.display = 'flex';

        fetch('/api/monsters/random') // Endpoint yang harus ada di Controller kamu
            .then(res => res.json())
            .then(data => {
                activeMonsterId = data.id;
                document.getElementById('m-name').innerText = data.name;
                document.getElementById('m-hp-text').innerText = data.health + " / " + data.health;
            });
}

function attackClick() {
    if (!activeMonsterId) return;
    
    fetch(`/api/battle/hero/${currentHeroId}/attack/${activeMonsterId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('battle-log').innerText = data.message;
            document.getElementById('m-hp-text').innerText = data.monsterHp + " / 100";
            document.getElementById('m-hp-fill').style.width = data.monsterHp + "%";
            
            if (data.monsterHp <= 0) {
                setTimeout(() => {
                    isBattleActive = false;
                    enemy.isAlive = false;
                    document.getElementById('battle-screen').style.display = 'none';
                }, 1500);
            }
        });
}

let lastTime = 0;
function gameLoop(time) {
    const dt = time - lastTime;
    lastTime = time;
    update(isNaN(dt) ? 0 : dt);
    draw();
    requestAnimationFrame(gameLoop);
}

resize();
loadAssets();