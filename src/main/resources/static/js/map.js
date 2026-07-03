// =========================================================================
// 1. INVENTARISASI & PEMUATAN ASET GAMBAR (LAYERING BACKGROUND + TILE)
// =========================================================================

// Lapisan 1: Langit Paling Belakang
const imgSky = new Image();
imgSky.src = "/assets/map_tiles/Battleground3/Bright/sky.png"; 

// Lapisan 2: Latar Belakang Hutan Siluet Semak
const imgJungleBg = new Image();
imgJungleBg.src = "/assets/map_tiles/Battleground3/Bright/jungle_bg.png"; 

// Lapisan 3: Pepohonan Sekunder & Semak Hijau
const imgTreesBushes = new Image();
imgTreesBushes.src = "/assets/map_tiles/Battleground3/Bright/trees&bushes.png"; 

// Lapisan 4: Akar Gantung / Lianas
const imgLianas = new Image();
imgLianas.src = "/assets/map_tiles/Battleground3/Bright/lianas.png";

// Lapisan 5: Kunang-kunang / Efek Cahaya (Fireflies)
const imgFireflies = new Image();
imgFireflies.src = "/assets/map_tiles/Battleground3/Bright/fireflys.png";

// Lapisan 6: Pohon Berwajah / Batang Detail Depan
const imgTreeFace = new Image();
imgTreeFace.src = "/assets/map_tiles/Battleground3/Bright/tree_face.png";

// Lapisan Utama 7: Spritesheet Lantai & Tanah
const imgGrassRoad = new Image();
imgGrassRoad.src = "/assets/map_tiles/Battleground3/Bright/grass&road.png"; 


// =========================================================================
// 2. KONFIGURASI UKURAN GRID MAP (800 x 450)
// =========================================================================
const TILE_SIZE = 32; 

// Matriks Peta Platformer:
// 0 = Udara Kosong (Menampilkan Background)
// 1 = Permukaan Rumput Atas (Top Grass)
// 2 = Isi Tanah Dalam (Dirt/Road)
const gameMap = [
    // Baris 1 - 18: Udara kosong tempat melihat background hutan (Total 18 baris)
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    
    // Baris 19-20: Permukaan Rumput Utama (Mengikuti ketinggian rasio 720)
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

// =========================================================================
// 3. FUNGSI UTAMA RENDERING MAP & BACKGROUND (URUTAN LAYER)
// =========================================================================
function drawGameMap(ctx) {
    const w = canvas.width; // Lebar canvas sesuai spesifikasi game.html
    const h = canvas.height;

    const bgYOffset = 0;
    const bgHeight = h;// Tinggi canvas

    // ─── A. RENDERING BACKGROUND LAYERS (Urutan dari Belakang ke Depan) ───
    
    // Layer 1: Langit
    if (imgSky.complete) ctx.drawImage(imgSky, 0, bgYOffset, w, bgHeight);
    
    // Layer 2: Siluet Hutan Belakang
    if (imgJungleBg.complete) ctx.drawImage(imgJungleBg, 0, bgYOffset, w, bgHeight);
    
    // Layer 3: Pepohonan & Semak Tengah
    if (imgTreesBushes.complete) ctx.drawImage(imgTreesBushes, 0, bgYOffset, w, bgHeight);
    
    // Layer 4: Akar Rambat Gantung
    if (imgLianas.complete) ctx.drawImage(imgLianas, 0, bgYOffset, w, bgHeight);
    
    // Layer 5: Partikel Kunang-kunang Mengambang
    if (imgFireflies.complete) ctx.drawImage(imgFireflies, 0, bgYOffset, w, bgHeight);
    
    if (imgGrassRoad.complete) ctx.drawImage(imgGrassRoad, 0, bgYOffset, w, bgHeight);
    
    // Layer 6: Pohon Berwajah & Foreground Detail Estetik
    if (imgTreeFace.complete) ctx.drawImage(imgTreeFace, 0, bgYOffset, w, bgHeight);
    // ─── B. RENDERING PLATFORM / TILEMAP UTAMA ───
    if (!imgGrassRoad.complete) return; // Tunggu ubin siap

        for (let r = 0; r < gameMap.length; r++) {
            for (let c = 0; c < gameMap[r].length; c++) {
                let tileType = gameMap[r][c];

                if (tileType === 0) continue; 

                let dx = c * TILE_SIZE;
                let dy = r * TILE_SIZE;
                
                let sx = 0;
                let sy = 0;

                if (tileType === 1) {
                    sx = 0; 
                    sy = 0;
                } else if (tileType === 2) {
                    sx = 0;
                    sy = TILE_SIZE; 
                }

                ctx.drawImage(
                    imgGrassRoad, 
                    sx, sy, TILE_SIZE, TILE_SIZE, 
                    dx, dy, TILE_SIZE, TILE_SIZE  
                );
            }
        }



}