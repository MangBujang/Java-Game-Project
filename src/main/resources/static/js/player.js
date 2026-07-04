// ======  REGISTRI ASET SEMUA KARAKTER ======
const characterAssets = {
    WIZARD: {
        idle: new Image(),
        run: new Image(),
        jump: new Image(),
        folder: "Wanderer Magican"
    },
    KNIGHT: {
        idle: new Image(),
        run: new Image(),
        jump: new Image(),
        folder: "Knight"
    },
    ARCHER: {
        idle: new Image(),
        run: new Image(),
        jump: new Image(),
        folder: "Archer"
    }
};

// ====== LOAD SPRITE ======
const imgHeroIdle = new Image();
imgHeroIdle.src = "/assets/player/Wanderer Magican/Idle.png";

const imgHeroRun = new Image();
imgHeroRun.src = "/assets/player/Wanderer Magican/Run.png";

const imgHeroJump = new Image();
imgHeroJump.src = "/assets/player/Wanderer Magican/Jump.png";

// ====== HERO CONFIG ======
const hero = {
    x: 100,
    y: 220,

    width: 300,
    height: 300,

    spriteWidth: 128,
    spriteHeight: 128,

    frameX: 0,
    maxFrames: 8,
    frameTimer: 0,
    frameInterval: 8,

    speed: 8,
    velocityY: 0,
    gravity: 0.5,
    jumpPower: -15,
    isGrounded: false,

    direction: "RIGHT",
    isMoving: false,

    animation: "IDLE",
    prevAnimation: "IDLE",

    jumpFrames: 4 // jumlah frame jump
};

// ====== INPUT ======
const keysPressed = {};

window.addEventListener("keydown", (event) => {
    keysPressed[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keysPressed[event.key.toLowerCase()] = false;
});

// ====== UPDATE LOGIC ======
function updatePlayerLogic() {
    if (gameState !== "PLAYING") return;

    hero.isMoving = false;

    // Gerak kiri
    if (keysPressed["a"] || keysPressed["arrowleft"]) {
        hero.x -= hero.speed;
        hero.direction = "LEFT";
        hero.isMoving = true;
    }
    // Gerak kanan
    else if (keysPressed["d"] || keysPressed["arrowright"]) {
        hero.x += hero.speed;
        hero.direction = "RIGHT";
        hero.isMoving = true;
    }

    // Lompat
    if ((keysPressed["w"] || keysPressed[" "] || keysPressed["arrowup"]) && hero.isGrounded) {
        hero.velocityY = hero.jumpPower;
        hero.isGrounded = false;
    }

    // Gravitasi
    hero.velocityY += hero.gravity;
    hero.y += hero.velocityY;

    const groundLevel = 230;

    if (hero.y >= groundLevel) {
        hero.y = groundLevel;
        hero.velocityY = 0;
        hero.isGrounded = true;
    }

    // Batas canvas
    if (hero.x < 0) hero.x = 0;
    if (hero.x > canvas.width - hero.width) {
        hero.x = canvas.width - hero.width;
    }

    // ====== SET ANIMASI ======
    if (!hero.isGrounded) {
        hero.animation = "JUMP";
    } else if (hero.isMoving) {
        hero.animation = "RUN";
    } else {
        hero.animation = "IDLE";
    }

    // RESET FRAME kalau animasi berubah
    if (hero.animation !== hero.prevAnimation) {
        hero.frameX = 0;
        hero.frameTimer = 0;
        hero.prevAnimation = hero.animation;
    }

    // SET SPEED + FRAME
    if (hero.animation === "RUN") {
        hero.frameInterval = 4;
        hero.maxFrames = 8;
    } 
    else if (hero.animation === "JUMP") {
        hero.frameInterval = 6;
        hero.maxFrames = hero.jumpFrames;
    } 
    else {
        hero.frameInterval = 10;
        hero.maxFrames = 8;
    }
}

// ====== DRAW PLAYER ======
function drawPlayer(ctx) {
    if (gameState !== "PLAYING") return;

    let currentImage;

    if (hero.animation === "RUN") {
        currentImage = imgHeroRun;
    } else if (hero.animation === "JUMP") {
        currentImage = imgHeroJump;
    } else {
        currentImage = imgHeroIdle;
    }

    if (currentImage.complete && currentImage.naturalWidth !== 0) {
        let sx = hero.frameX * hero.spriteWidth;
        let sy = 0;

        const centerX = hero.x + hero.width / 2;
        const centerY = hero.y + hero.height / 2;

        if (hero.direction === "LEFT") {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale(-1, 1);

            ctx.drawImage(
                currentImage,
                sx, sy,
                hero.spriteWidth, hero.spriteHeight,
                -hero.width / 2, -hero.height / 2,
                hero.width, hero.height
            );

            ctx.restore();
        } else {
            ctx.drawImage(
                currentImage,
                sx, sy,
                hero.spriteWidth, hero.spriteHeight,
                hero.x, hero.y,
                hero.width, hero.height
            );
        }

        // ====== ANIMASI FRAME ======
        if (hero.animation === "JUMP") {
            // biar ga looping terus (lebih realistis)
            if (hero.frameX < hero.maxFrames - 1) {
                hero.frameTimer++;
                if (hero.frameTimer > hero.frameInterval) {
                    hero.frameX++;
                    hero.frameTimer = 0;
                }
            }
        } else {
            hero.frameTimer++;
            if (hero.frameTimer > hero.frameInterval) {
                hero.frameX = (hero.frameX + 1) % hero.maxFrames;
                hero.frameTimer = 0;
            }
        }
    }
}