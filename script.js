const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = 300;
const snake = [{ x: gridSize * 2, y: gridSize * 2 }];
let food = { x: 0, y: 0 };
let direction = { x: gridSize, y: 0 };
let score = 0;
let gameInterval;
let changingDirection = false;

function resetGame() {
    console.log('Game reset');
    snake.length = 1;
    snake[0] = { x: gridSize * 2, y: gridSize * 2 };
    direction = { x: gridSize, y: 0 };
    score = 0;
    document.getElementById('score').innerText = `Score: ${score}`;
    placeFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
    changingDirection = false;
}

function placeFood() {
    let validPosition = false;
    let retryCount = 0;

    while (!validPosition && retryCount < 100) {  // Retry up to 100 times
        food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;

        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
        retryCount++;
    }

    if (validPosition) {
        console.log(`Food placed at (${food.x}, ${food.y})`);
    } else {
        console.error('Failed to place food after 100 tries.');
    }
}

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawSquare(segment.x, segment.y, '#00FF00'));
}

function drawFood() {
    console.log(`Drawing food at (${food.x}, ${food.y})`);
    drawSquare(food.x, food.y, '#FF0000');
}

function moveSnake() {
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };

    // Check if snake hits the wall
    if (newHead.x >= canvasSize || newHead.x < 0 || newHead.y >= canvasSize || newHead.y < 0) {
        resetGame();
        return;
    }

    snake.unshift(newHead);

    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;
        placeFood();  // Place new food after eating
    } else {
        snake.pop();
    }

    // Check collision with self
    if (snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        resetGame();
    }

    changingDirection = false;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    moveSnake();
    drawSnake();
    drawFood();  // Ensure food is always drawn
}

function changeDirection(event) {
    if (changingDirection) return;
    const keyPressed = event.keyCode;

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = direction.y === -gridSize;
    const goingDown = direction.y === gridSize;
    const goingRight = direction.x === gridSize;
    const goingLeft = direction.x === -gridSize;

    if (keyPressed === LEFT && !goingRight) {
        direction = { x: -gridSize, y: 0 };
    }
    if (keyPressed === UP && !goingDown) {
        direction = { x: 0, y: -gridSize };
    }
    if (keyPressed === RIGHT && !goingLeft) {
        direction = { x: gridSize, y: 0 };
    }
    if (keyPressed === DOWN && !goingUp) {
        direction = { x: 0, y: gridSize };
    }

    changingDirection = true;
}

document.getElementById('startBtn').addEventListener('click', resetGame);
document.addEventListener('keydown', changeDirection);
resetGame();  // Initialize the game
