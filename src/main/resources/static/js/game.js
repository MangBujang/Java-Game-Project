
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- 1. KONFIGURASI ASET & MAP ---
const TILE_SIZE = 64; 
const MAP_ASSETS_URL = "/assets/map_tiles/Assetpack_AlienForest/";

// Mapping nama file sesuai folder Assetpack_AlienForest
const tileNames = [
    "Tile_Up_CornerLeft", "Tile_Up_Middle", "Tile_Up_CornerRight",
    "Tile_Mid_SideLeft", "Tile_Mid_Middle", "Tile_Mid_SideRight",
    "Tile_Low_CornerLeft", "Tile_Low_Middle", "Tile_Low_CornerRight",
    "Plant_grass", "Tree_Small", "Rock_small1", "Background_L4"
];

const tileImages = {};

// Susunan Map menggunakan nama file (Sesuai aset Alien Forest kamu)
const MAP_DATA = [
    ["Tile_Up_CornerLeft", "Tile_Up_Middle", "Tile_Up_Middle", "Tile_Up_CornerRight"],
    ["Tile_Mid_SideLeft", "Tile_Mid_Middle", "Tile_Mid_Middle", "Tile_Mid_SideRight"],
    ["Tile_Low_CornerLeft", "Tile_Low_Middle", "Tile_Low_Middle", "Tile_Low_CornerRight"],
    ["Plant_grass", null, null, "Rock_small1"]
];

// --- 2. ENTITAS (HERO & PET) ---
const hero = {
    x: 150,
    y: 150,
    speed: 5,
    width: 48,
    height: 48,
    name: "Hero"
};

const pet = {
    x: 100,
    y: 150,
    width: 32,
    height: 32,
    name: "Pet"
};

const keys = {};

// --- 3. FUNGSI PEMUATAN ---
function loadAssets() {
    tileNames.forEach(name => {
        const img = new Image();
        img.src = `${MAP_ASSETS_URL}${name}.png`;
        
        img.onload = () => console.log(`✅ Loaded: ${name}`);
        img.onerror = () => console.error(`❌ Error Loading: ${img.src}`);
        
        tileImages[name] = img;
    });
}

function fetchHeroData() {
    fetch('/api/setup/current-hero')
        .then(res => res.json())
        .then(data => {
            hero.name = data.name;
            if(data.dragons && data.dragons.length > 0) {
                pet.name = data.dragons[0].name;
            }
            // Update UI dan hapus loading
            const display = document.getElementById('hero-display');
            display.innerText = `${hero.name} & ${pet.name}`;
        })
        .catch(err => {
            console.warn("Gagal mengambil data hero dari API, menggunakan default.");
            document.getElementById('hero-display').innerText = "Petualang Terasing";
        });
}

// --- 4. LOGIKA PERMAINAN ---
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
    // Gerakan Hero
    if (keys['KeyW'] || keys['ArrowUp']) hero.y -= hero.speed;
    if (keys['KeyS'] || keys['ArrowDown']) hero.y += hero.speed;
    if (keys['KeyA'] || keys['ArrowLeft']) hero.x -= hero.speed;
    if (keys['KeyD'] || keys['ArrowRight']) hero.x += hero.speed;

    // Smooth Follower Pet (Naga)
    const targetX = hero.x - 60;
    const targetY = hero.y - 15;
    pet.x += (targetX - pet.x) * 0.1;
    pet.y += (targetY - pet.y) * 0.1;
}

// --- 5. PENGGAMBARAN (RENDERING) ---
function renderTilemap() {
    for (let row = 0; row < MAP_DATA.length; row++) {
        for (let col = 0; col < MAP_DATA[row].length; col++) {
            const tileName = MAP_DATA[row][col];
            if (!tileName) continue;

            const img = tileImages[tileName];
            if (img && img.complete && img.naturalWidth !== 0) {
                ctx.drawImage(
                    img, 
                    Math.floor(col * TILE_SIZE), 
                    Math.floor(row * TILE_SIZE), 
                    TILE_SIZE + 1, // +1 untuk menghilangkan celah (bleeding edges)
                    TILE_SIZE + 1
                );
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Layer 1: Background (Opsional, gunakan L4 sebagai langit)
    if (tileImages["Background_L4"]) {
        ctx.drawImage(tileImages["Background_L4"], 0, 0, canvas.width, canvas.height);
    }

    // Layer 2: Tanah (Tilemap)
    renderTilemap();

    // Layer 3: Dekorasi (Pohon)
    if (tileImages["Tree_Small"]) {
        ctx.drawImage(tileImages["Tree_Small"], 400, 100, 120, 140);
    }

    // Layer 4: Entitas (Placeholder kotak sebelum ada sprite karakter)
    // Draw Pet
    ctx.fillStyle = "#FF9800"; 
    ctx.fillRect(pet.x, pet.y, pet.width, pet.height);
    
    // Draw Hero
    ctx.fillStyle = "#00BCD4";
    ctx.fillRect(hero.x, hero.y, hero.width, hero.height);

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

// --- 6. INISIALISASI ---
window.onload = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    loadAssets();
    fetchHeroData();
    draw();
};

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

