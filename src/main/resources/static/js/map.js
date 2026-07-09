// =========================================================================
// 1. LOAD ASET
// =========================================================================

// Background
const imgSky = new Image();
imgSky.src = "/assets/map_tiles/Battleground3/Bright/sky.png";

const imgJungleBg = new Image();
imgJungleBg.src = "/assets/map_tiles/Battleground3/Bright/jungle_bg.png";

const imgTreesBushes = new Image();
imgTreesBushes.src = "/assets/map_tiles/Battleground3/Bright/trees&bushes.png";

const imageGrasses = new Image();
imageGrasses.src = "/assets/map_tiles/Battleground3/Bright/grasses.png";

const imgLianas = new Image();
imgLianas.src = "/assets/map_tiles/Battleground3/Bright/lianas.png";

const imgFireflies = new Image();
imgFireflies.src = "/assets/map_tiles/Battleground3/Bright/fireflys.png";

const imgTreeFace = new Image();
imgTreeFace.src = "/assets/map_tiles/Battleground3/Bright/tree_face.png";

const imgGrassRoad = new Image();
imgGrassRoad.src = "/assets/map_tiles/Battleground3/Bright/grass&road.png";

// Tile spritesheet
const imgTiles = new Image();
imgTiles.src = "/assets/map_tiles/GandalfHardcore FREE Platformer Assets/Floor Tiles2.png";


// =========================================================================
// 2. KONFIGURASI UKURAN GRID MAP (800 x 450)
// =========================================================================
const TILE_SIZE = 32; 

// Matriks Peta Platformer:
// 0 = Udara Kosong (Menampilkan Background)
// 1 = Permukaan Rumput Atas (Top Grass)
// 2 = Isi Tanah Dalam (Dirt/Road)
const gameMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

const tileTypes = {
  1: { sx: 0, sy: 0 },
  2: { sx: 32, sy: 0 },
  3: { sx: 64, sy: 0 }
};

// =========================================================================
// 4. MODULE: BACKGROUND (DENGAN REPEATING PARALLAX)
// =========================================================================
function drawBackground(ctx) {
    const w = canvas.width;
    const h = canvas.height;

    // Ambil variabel global cameraX dari main.js (fallback ke 0 jika belum ada)
    const camX = typeof cameraX !== "undefined" ? cameraX : 0;

    // 1. Langit (Sky): Statis / Diam (tidak dikalikan kamera)
    if (imgSky.complete) ctx.drawImage(imgSky, 0, 0, w, h);
    
    // Fungsi pembantu untuk menggambar background bergulir secara mulus tanpa putus
    const drawLoopingLayer = (img, speedFactor) => {
        if (img.complete) {
            // Hitung posisi x awal (bergeser mundur)
            let x = -(camX * speedFactor) % w;
            
            // Gambar potongan pertama
            ctx.drawImage(img, x, 0, w, h);
            
            // Gambar potongan kedua di sebelah kanannya agar menyambung saat bergulir
            if (x < 0) {
                ctx.drawImage(img, x + w, 0, w, h);
            }
        }
    };

    // 2. Latar Belakang Hutan (Jungle Bg): Sangat lambat (efek paling jauh)
    drawLoopingLayer(imgJungleBg, 0.1);
    
    // 3. Pohon & Semak (Trees & Bushes): Agak lambat
    drawLoopingLayer(imgTreesBushes, 0.3);
    
    // 🔥 4. Rumput Liar Latar (Grasses): Kecepatan 0.4 (Berada di depan pepohonan latar)
    drawLoopingLayer(imageGrasses, 0.4);
    
    // 5. Lianas: Kecepatan sedang
    drawLoopingLayer(imgLianas, 0.5);
    
    // 6. Kunang-kunang (Fireflies): Kecepatan sedang
    drawLoopingLayer(imgFireflies, 0.6);
    
    // 7. Jalan Berumput (Grass Road): Bergerak cepat mendekati kecepatan ubin asli
    drawLoopingLayer(imgGrassRoad, 0.8);
}

// =========================================================================
// 5. MODULE: TILE MAP (PERBAIKAN PERGESERAN KAMERA)
// =========================================================================
function drawTiles(ctx) {
  // Ambil variabel global cameraX dari main.js (fallback ke 0 jika belum ada)
  const camX = typeof cameraX !== "undefined" ? cameraX : 0;

  for (let row = 0; row < gameMap.length; row++) {
    for (let col = 0; col < gameMap[row].length; col++) {
      
      const tile = gameMap[row][col];
      
      if (tile !== 0) {
        const t = tileTypes[tile];

        ctx.drawImage(
            imgTiles,
            t.sx, t.sy, TILE_SIZE, TILE_SIZE, 
            (col * TILE_SIZE) - camX, // Posisi X dikurangi camX agar bergeser mundur
            row * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
        );
      }

    }
  }
}

// =========================================================================
// 6. MODULE: FOREGROUND (PARALLAX DEPAN)
// =========================================================================
function drawForeground(ctx) {
    const w = canvas.width;
    const h = canvas.height;
    const camX = typeof cameraX !== "undefined" ? cameraX : 0;

    // Pohon depan (Tree Face): Mengikuti ground (dikali 1.0)
    if (imgTreeFace.complete) {
        let x = -(camX * 1.0) % w;
        ctx.drawImage(imgTreeFace, x, 0, w, h);
        if (x < 0) {
            ctx.drawImage(imgTreeFace, x + w, 0, w, h);
        }
    }
}

// =========================================================================
// 7. MAIN RENDER FUNCTION
// =========================================================================
function drawGameMap(ctx) {
    drawBackground(ctx);  // belakang
    drawForeground(ctx);  // depan
    drawTiles(ctx);       // middle (map utama)
}