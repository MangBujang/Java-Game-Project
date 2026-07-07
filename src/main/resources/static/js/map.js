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
// 4. MODULE: BACKGROUND
// =========================================================================
function drawBackground(ctx) {
    const w = canvas.width;
    const h = canvas.height;

    if (imgSky.complete) ctx.drawImage(imgSky, 0, 0, w, h);
    if (imgJungleBg.complete) ctx.drawImage(imgJungleBg, 0, 0, w, h);
    if (imgTreesBushes.complete) ctx.drawImage(imgTreesBushes, 0, 0, w, h);
    if (imgLianas.complete) ctx.drawImage(imgLianas, 0, 0, w, h);
    if (imgFireflies.complete) ctx.drawImage(imgFireflies, 0, 0, w, h);
    if (imgGrassRoad.complete) ctx.drawImage(imgGrassRoad, 0, 0, w, h);
}

// =========================================================================
// 5. MODULE: TILE MAP (FIX UTAMA DI SINI)
// =========================================================================
function drawTiles(ctx) {
  for (let row = 0; row < gameMap.length; row++) {
    for (let col = 0; col < gameMap[row].length; col++) {
      
      const tile = gameMap[row][col];
      
      if (tile !== 0) {
        const t = tileTypes[tile];

        ctx.drawImage(
            imgTiles,
            t.sx, t.sy, TILE_SIZE, TILE_SIZE, 
            col * TILE_SIZE,
            row * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
        );
      }

    }
  }
}

// =========================================================================
// 6. MODULE: FOREGROUND
// =========================================================================
function drawForeground(ctx) {
    const w = canvas.width;
    const h = canvas.height;

    if (imgTreeFace.complete) {
        ctx.drawImage(imgTreeFace, 0, 0, w, h);
    }
}



// =========================================================================
// 7. MAIN RENDER FUNCTION
// =========================================================================
function drawGameMap(ctx) {
    drawBackground(ctx);  // belakang
    drawTiles(ctx);       // middle (map utama)
    drawForeground(ctx);  // depan
}
