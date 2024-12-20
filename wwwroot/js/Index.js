window.canvas = document.querySelector('canvas');
window.c = canvas.getContext('2d');
const resW = 1920;
const resH = 1080;
window.collisionMapImage = new Image();
c.imageSmoothingEnabled = false;

window.loadedPlayerNickname = null;

loadProgress();

// Let the CSS handle the visual scaling
function scaleToFitScreen() {
    // Set the canvas's internal resolution
    canvas.width = resW;
    canvas.height = resH;
    c.imageSmoothingEnabled = false;
}

window.addEventListener('resize', () => {
    scaleToFitScreen(); // For fitting content with letterboxing
});

scaleToFitScreen();

let isPaused = false;
let gameStarted = false;
let animationFrameId = null;

const menu = document.querySelector('.menu'); // Reference to the main menu

window.map = {
    x: -600,
    y: -3700,
    movementSpeed: 10,
    width: 5000,
    height: 5000,
};

window.movementKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
};

const playerDimensions = {
    width: 16 * 6,
    height: 16 * 6,
};

window.collisionMapData = null;

// Animation state variables
let animationFrameCounter = 0;
const animationFrameThreshold = 10; // Adjust for animation speed
const idleAnimationFrameThreshold = 60; // Slower idle animation
let currentDirection = 'down';
let lastDirection = 'down';
let i = 0; // Animation frame index
let playerSprite = [0, 0, 64, 64];

window.showExclamationMark = true;

// Preloading Images
window.exclemationMarkImage = new Image();
exclemationMarkImage.src = '/img/exclamation-mark.png';

window.mapImage = new Image();
mapImage.src = '/img/html-mansion1-no-fireplace.png';

window.playerImage = new Image();
playerImage.src = '/img/Jean-Clér.png';

const Dracula = new Image();
Dracula.src = '/img/16x16 Vampire.png';

function togglePause() {
    if (!gameStarted) return;

    if (isPaused) {
        pauseMenu.style.display = 'none';
        isPaused = false;
        validateCollisionMapData(); // Validate collision map on unpause
        startGameLoop();
    } else {
        pauseMenu.style.display = 'flex';
        isPaused = true;
        stopGameLoop();
    }
}

function validateCollisionMapData() {
    if (!collisionMapData) {
        loadCollisionMap(() => {
        });
    }
}

const pauseMenu = createPauseMenu(togglePause);
pauseMenu.style.display = 'none';

function movement() {
    window.addEventListener('keydown', (event) => {
        if (isPaused || !gameStarted || window.taskActive) return;

        switch (event.key.toLowerCase()) {
            case 'w':
                movementKeys.up = true;
                break;
            case 'a':
                movementKeys.left = true;
                break;
            case 's':
                movementKeys.down = true;
                break;
            case 'd':
                movementKeys.right = true;
                break;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (isPaused || !gameStarted) return;

        switch (event.key.toLowerCase()) {
            case 'w':
                movementKeys.up = false;
                break;
            case 'a':
                movementKeys.left = false;
                break;
            case 's':
                movementKeys.down = false;
                break;
            case 'd':
                movementKeys.right = false;
                break;
        }
    });
}

function startGameLoop() {
    if (!animationFrameId) {
        animationFrameId = window.requestAnimationFrame(gameLoop);
    }
}

function stopGameLoop() {
    if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function gameLoop() {
    if (!isPaused) {
        update();
        render();
        animationFrameId = window.requestAnimationFrame(gameLoop);
    }
}

function update() {
    const playerX = canvas.width / 2 - playerDimensions.width / 2;
    const playerY = canvas.height / 2 - playerDimensions.height / 2;

    const collisionX = playerX - map.x;
    const collisionY = playerY - map.y;

    let moving = false;

    if (
        (movementKeys.up && movementKeys.down) ||
        (movementKeys.left && movementKeys.right)
    ) {
        resetPlayerSprite();
        return;
    }

    if (movementKeys.up && !checkCollision(collisionX, collisionY, playerDimensions.width, playerDimensions.height, 'up')) {
        map.y += map.movementSpeed;
        moving = true;
        currentDirection = 'up';
    }
    if (movementKeys.down && !checkCollision(collisionX, collisionY, playerDimensions.width, playerDimensions.height, 'down')) {
        map.y -= map.movementSpeed;
        moving = true;
        currentDirection = 'down';
    }
    if (movementKeys.left && !checkCollision(collisionX, collisionY, playerDimensions.width, playerDimensions.height, 'left')) {
        map.x += map.movementSpeed;
        moving = true;
        currentDirection = 'left';
    }
    if (movementKeys.right && !checkCollision(collisionX, collisionY, playerDimensions.width, playerDimensions.height, 'right')) {
        map.x -= map.movementSpeed;
        moving = true;
        currentDirection = 'right';
    }

    if (moving) {
        lastDirection = currentDirection;
        animationFrameCounter++;
        if (animationFrameCounter >= animationFrameThreshold) {
            updatePlayerSprite(currentDirection);
            animationFrameCounter = 0;
        }
    } else {
        idleAnimation(lastDirection);
    }

    // Update Dracula's animation
    updateDraculaAnimation();
}

function updatePlayerSprite(direction) {
    switch (direction) {
        case 'up':
            playerSprite = [(i % 4) * 64, 64 * 6];
            break;
        case 'down':
            playerSprite = [(i % 4) * 64, 64 * 4];
            break;
        case 'left':
            playerSprite = [(i % 4) * 64, 64 * 7];
            break;
        case 'right':
            playerSprite = [(i % 4) * 64, 64 * 5];
            break;
    }
    i = (i + 1) % 4;
}

function idleAnimation(direction) {
    const idleRow = {
        down: 0,
        right: 1,
        up: 2,
        left: 3,
    }[direction];
    playerSprite = [(i % 2) * 64, 64 * idleRow];
    animationFrameCounter++;
    if (animationFrameCounter >= idleAnimationFrameThreshold) {
        i = (i + 1) % 2;
        animationFrameCounter = 0;
    }
}

function resetPlayerSprite() {
    idleAnimation(lastDirection);
    i = 0;
}

// Dracula animation state variables
let draculaFrameCounter = 0;
let draculaFrameIndex = 0;
const draculaAnimationFrameThreshold = 30; // Use the same threshold

function updateDraculaAnimation() {
    draculaFrameCounter++;
    if (draculaFrameCounter >= draculaAnimationFrameThreshold) {
        draculaFrameIndex = (draculaFrameIndex + 1) % 4;
        draculaFrameCounter = 0;
    }
}

window.draculaPosition = {x: -873, y: -4184};

function render() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.drawImage(mapImage, map.x, map.y);

    c.drawImage(
        Dracula,
        draculaFrameIndex * 16, 0, 16, 16,
        map.x - draculaPosition.x,
        map.y - draculaPosition.y,
        64 * 1.5, 64 * 2 // Scaled width and height
    );

    if (window.showExclamationMark) {
        c.drawImage(
            exclemationMarkImage,
            map.x - draculaPosition.x + 50,
            map.y - draculaPosition.y - 60,
            64,
            64
        );
    }

    c.drawImage(
        playerImage,
        playerSprite[0],
        playerSprite[1],
        64,
        64,
        canvas.width / 2 - playerDimensions.width / 2,
        canvas.height / 2 - playerDimensions.height / 2,
        playerDimensions.width,
        playerDimensions.height
    );
}

function checkCollision(x, y, width, height, direction) {
    if (!collisionMapData) return false;

    switch (direction) {
        case 'up':
            for (let offsetX = 0; offsetX < width; offsetX++) {
                if (isPixelWhite(x + offsetX, y - map.movementSpeed)) return true;
            }
            break;
        case 'down':
            for (let offsetX = 0; offsetX < width; offsetX++) {
                if (isPixelWhite(x + offsetX, y + height + map.movementSpeed - 1)) return true;
            }
            break;
        case 'left':
            for (let offsetY = 0; offsetY < height; offsetY++) {
                if (isPixelWhite(x - map.movementSpeed, y + offsetY)) return true;
            }
            break;
        case 'right':
            for (let offsetY = 0; offsetY < height; offsetY++) {
                if (isPixelWhite(x + width + map.movementSpeed - 1, y + offsetY)) return true;
            }
            break;
    }
    return false;
}

function isPixelWhite(x, y) {
    if (!collisionMapData) return false;
    if (x < 0 || y < 0 || x >= collisionMapData.width || y >= collisionMapData.height) return false;

    const index = (y * collisionMapData.width + x) * 4;
    const [r, g, b, a] = collisionMapData.data.slice(index, index + 4);
    return r === 255 && g === 255 && b === 255 && a === 255;
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        togglePause();
    }
});

function loadCollisionMap(callback) {
    if (tasksDone >= 3) {
        window.collisionMapImage.src = '/img/html-mansion1-collisions2.png';
    } else {
        window.collisionMapImage.src = '/img/html-mansion1-collisions.png';
    }
    window.collisionMapImage.onload = () => {
        const offscreenCanvas = document.createElement('canvas');
        const offscreenContext = offscreenCanvas.getContext('2d');

        offscreenCanvas.width = collisionMapImage.width;
        offscreenCanvas.height = collisionMapImage.height;

        offscreenContext.drawImage(collisionMapImage, 0, 0);

        collisionMapData = offscreenContext.getImageData(0, 0, collisionMapImage.width, collisionMapImage.height);

        callback();
    };
}

document.getElementById('startGame').addEventListener('click', () => {
    gameStarted = true;
    canvas.style.display = 'block';
    document.getElementById("keybinds").style.display = "inline";

    if (menu) menu.style.display = 'none';
    movement();
    loadCollisionMap(() => {
        startGameLoop();
        if (window.showStartingNotification === true && tasksDone < 1) {
            showNotification("WASD to move, E to interact");
            window.showStartingNotification = false;
        }
    });
});

window.saveProgress = function () {
    player.nickname = playerName;
    const progress = {
        Player: window.player,
        currentTaskId: tasksDone,
        positionX: window.map.x,
        positionY: window.map.y,
        currentInteractionId: dracula_interaction,
        draculaPosition: window.draculaPosition,
    };

    fetch('/api/playerprogress/saveProgress/' + progressId, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(progress)
    })
}

window.updateMapImage = function (imagePath, onLoadCallback) {
    const preloadedImage = new Image();

    preloadedImage.onload = () => {
        mapImage.src = imagePath;
        if (onLoadCallback) onLoadCallback();
    };

    preloadedImage.src = imagePath;
};

function loadProgress() {
    fetch('/api/playerprogress/loadProgress')

        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(progress => {
            window.map.x = progress.positionX || 0;
            window.map.y = progress.positionY || 0;
            dracula_interaction = progress.currentInteractionId || 0;
            window.player = progress.player;
            window.progressId = progress.id;
            window.tasksDone = progress.currentTaskId || 0;
            window.draculaPosition = progress.draculaPosition || {x: -873, y: -4184};
            window.playerName = progress.player.nickname;

            if (tasksDone < 2) {
            } else if (tasksDone >= 2) {
                updateMapImage('/img/html-mansion-fireplace.png');
            } else if (tasksDone >= 4) {
                updateMapImage('/img/html-mansion-bedsheets.png');
            }

            if (tasksDone < 3) {
                updateCollisionMapImage('/img/html-mansion1-collisions.png')
            } else if (window.tasksDone >= 3) {
                updateCollisionMapImage('/img/html-mansion1-collisions2.png', () => {
                    window.draculaPosition = {x: -2450, y: -1570}; // New Dracula position
                });
            }

            changeSkinFunction(progress.player.skin);
        })
}

window.updateCollisionMapImage = function (imagePath, onLoadCallback) {
    const preloadedImage = new Image();

    preloadedImage.onload = () => {
        collisionMapImage.src = imagePath;
        if (onLoadCallback) onLoadCallback();
    };

    preloadedImage.src = imagePath;
}