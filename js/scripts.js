const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentScore = 0;
let slicedFruitsCount = 0;
let failedSlicesCount = 0;
const maxFailsAllowed = 3;
const fruits = ['apple', 'banana', 'strawberry', 'watermelon'];
const bomb = 'bomb';
const MAX_FRUITS_ON_SCREEN = 2;
const SPAWN_INTERVAL = 2000;
const MARGIN = 100;
const SLICE_DISTANCE = 5;

let spawnedItems = [];
let isDragging = false;
let sliceStartX = 0;
let sliceStartY = 0;
let gameOver = false;
let gameTime = 0;
let timerInterval;

const swordImage = new Image();
swordImage.src = 'img/daggar.png';

const gameOverSprite = new Image();
gameOverSprite.src = 'img/game_over.png';

let mouseX = 0;
let mouseY = 0;

const fruitSprites = {};
const fruitSliceSprites = {};
const bombSprite = new Image();
bombSprite.src = 'img/bomb_sprite.png';

const backgroundMusic = new Audio('background_music.mp3');
const sliceSound = new Audio('slice_sound.mp3');

fruits.forEach(fruit => {
    fruitSprites[fruit] = new Image();
    fruitSprites[fruit].src = `img/${fruit}_sprite.png`;
    fruitSliceSprites[fruit] = {
        left: new Image(),
        right: new Image()
    };
    fruitSliceSprites[fruit].left.src = `img/${fruit}_slice_left.png`;
    fruitSliceSprites[fruit].right.src = `img/${fruit}_slice_right.png`;
});

function playBackgroundMusic() {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    backgroundMusic.play();
}

function playSliceSound() {
    sliceSound.currentTime = 0;
    sliceSound.play();
}

function drawSwordAndSliceEffect() {
    if (isDragging) {
        ctx.beginPath();
        ctx.moveTo(sliceStartX, sliceStartY);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    }
    ctx.drawImage(swordImage, mouseX - 16, mouseY - 16, 32, 32);
}

function spawnItem() {
    const isBomb = Math.random() < 0.2;
    if (isBomb && spawnedItems.length === 0) {
        spawnedItems.push({
            x: Math.random() * (canvas.width - 2 * MARGIN) + MARGIN,
            y: canvas.height,
            type: bomb,
            velocityX: 0,
            velocityY: 3.8
        });
    } else {
        const numberOfItems = Math.floor(Math.random() * (MAX_FRUITS_ON_SCREEN - spawnedItems.length)) + 1;
        for (let i = 0; i < numberOfItems; i++) {
            if (spawnedItems.length >= MAX_FRUITS_ON_SCREEN) return;

            const x = Math.random() * (canvas.width - 2 * MARGIN) + MARGIN;
            const type = fruits[Math.floor(Math.random() * fruits.length)];
            const y = canvas.height;
            const velocityX = (Math.random() - 0.5) * 4;
            const velocityY = 3.8;

            spawnedItems.push({ x, y, type, velocityX, velocityY });
        }
    }
}

function updateItems() {
    for (let i = spawnedItems.length - 1; i >= 0; i--) {
        const item = spawnedItems[i];
        item.y -= item.velocityY;
        item.x += item.velocityX;
        item.velocityY -= 0.1;

        if (item.y > canvas.height) {
            spawnedItems.splice(i, 1);
            if (item.type !== bomb) {
                failedSlicesCount++; // Increment failed slices for missed fruits
            }
        }
    }
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gameOverSprite, canvas.width / 2 - 150, canvas.height / 2 - 100, 300, 200);
}

function drawItems() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const item of spawnedItems) {
        if (item.type === bomb) {
            ctx.drawImage(bombSprite, item.x - 16, item.y - 16, 32, 32);
        } else if (item.type.includes('_left') || item.type.includes('_right')) {
            const offset = item.type.includes('_left') ? -SLICE_DISTANCE : SLICE_DISTANCE;
            ctx.drawImage(
                fruitSliceSprites[item.type.replace('_left', '').replace('_right', '')][item.type.includes('_left') ? 'left' : 'right'],
                item.x + offset - 16,
                item.y - 16,
                32,
                32
            );
        } else {
            ctx.drawImage(fruitSprites[item.type], item.x - 16, item.y - 16, 32, 32);
        }
    }
    drawSwordAndSliceEffect();
    document.getElementById('score').textContent = `🍉: ${currentScore}`;
    document.getElementById('timer').textContent = `${gameTime.toFixed(1)}`;
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    sliceStartX = mouseX;
    sliceStartY = mouseY;
});

canvas.addEventListener('mouseup', (event) => {
    isDragging = false;
    let sliced = false; // Flag to check if any fruit is sliced

    for (let i = spawnedItems.length - 1; i >= 0; i--) {
        const item = spawnedItems[i];

        if (item.type === bomb) {
            alert("Game Over! You sliced a bomb.");
            gameOver = true;
            clearInterval(timerInterval);
            backgroundMusic.pause();
           endGame();
            return; // Stop further processing
        }

        // Check if the fruit is sliced
        if (sliceFruit(item, sliceStartX, sliceStartY, mouseX, mouseY)) {
            spawnedItems.splice(i, 1);
            playSliceSound();
            increaseScore();
            sliced = true; // Mark that something was sliced
        }
    }

    // If no fruits were sliced, count it as a failed slice
    if (!sliced) {
        failedSlicesCount++;
        if (failedSlicesCount >= maxFailsAllowed) {
            alert("Game Over! You failed to slice enough fruits.");
            gameOver = true;
            clearInterval(timerInterval);
            backgroundMusic.pause();
            endGame();
            setTimeout(() => {
                window.location.href = 'game-over.html'; // Redirect to leaderboard
            }, 100);
        }
    }
});

function sliceFruit(fruit, startX, startY, endX, endY) {
    const dx = fruit.x - startX;
    const dy = fruit.y - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= 50) {
        spawnedItems.push({
            x: fruit.x - SLICE_DISTANCE,
            y: fruit.y,
            type: `${fruit.type}_left`,
            velocityX: -1,
            velocityY: 2
        });
        spawnedItems.push({
            x: fruit.x + SLICE_DISTANCE,
            y: fruit.y,
            type: `${fruit.type}_right`,
            velocityX: 1,
            velocityY: 2
        });
        slicedFruitsCount++;
        return true;
    }
    return false;
}

function increaseScore() {
    currentScore += 10;
    console.log(`🍉: ${currentScore}`);
}

function updateTimer() {
    if (!gameOver) {
        gameTime += 0.1;
        console.log(`Current Time: ${gameTime.toFixed(1)}`);
    }
}


// At the end of your game logic, right before the redirect:
function endGame() {
    localStorage.setItem('finalScore', currentScore);
    localStorage.setItem('finalTime', gameTime.toFixed(1)); // Or format it to mm:ss if needed
    

    setTimeout(() => {
        window.location.href = 'game-over.html'; // Redirect to leaderboard
    }, 100); // Redirect to the game-over page
}


function gameLoop() {
    if (!gameOver) {
        updateItems();
        drawItems();
        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}


setInterval(spawnItem, SPAWN_INTERVAL);
timerInterval = setInterval(updateTimer, 100);
playBackgroundMusic();
gameLoop();
