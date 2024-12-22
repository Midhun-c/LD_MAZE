const ROWS = 5;
const COLS = 5;
const CELL_SIZE = 50;
let playerRow = 0;
let playerCol = 0;
let goalRow = 4;
let goalCol = 4;
let obstacles = generateObstacles();
let timer = 0;
let gameInterval;
let isGameOver = false;
let currentPhase = "dark";  // Start with dark phase

const gameBoard = document.getElementById('game-board');
const gameMessage = document.getElementById('game-message');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart-button');
const body = document.body;  // To toggle light/dark mode

function generateObstacles() {
    const obstacles = [];
    for (let i = 0; i < 5; i++) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);
        if (!(row === 0 && col === 0) && !(row === goalRow && col === goalCol)) {
            obstacles.push({ row, col });
        }
    }
    return obstacles;
}

function createGameBoard() {
    gameBoard.innerHTML = '';  // Clear previous board
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (obstacles.some(ob => ob.row === row && ob.col === col)) {
                cell.classList.add('obstacle');
            }
            if (row === playerRow && col === playerCol) {
                cell.innerText = '😊';  // Player emoji
            }
            if (row === goalRow && col === goalCol) {
                cell.innerText = '🧈';  // Goal emoji
            }
            gameBoard.appendChild(cell);
        }
    }

    // Apply the correct theme based on current phase
    if (currentPhase === "light") {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }
}

function movePlayer(direction) {
    if (isGameOver) return; // Prevent movement after game over

    if (direction === 'Up' && playerRow > 0) playerRow--;
    if (direction === 'Down' && playerRow < ROWS - 1) playerRow++;
    if (direction === 'Left' && playerCol > 0) playerCol--;
    if (direction === 'Right' && playerCol < COLS - 1) playerCol++;

    // Check for collision with obstacles
    if (currentPhase === "light" || obstacles.some(ob => ob.row === playerRow && ob.col === playerCol)) {
        endGame("Game Over!");
        return;
    }

    // Check for goal reached
    if (playerRow === goalRow && playerCol === goalCol) {
        endGame("You Win!");
        return;
    }

    createGameBoard();  // Update board
}

function startTimer() {
    gameInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

function endGame(message) {
    clearInterval(gameInterval);  // Stop the timer
    gameMessage.textContent = message;
    restartButton.style.display = 'block';
    isGameOver = true;
}

function restartGame() {
    playerRow = 0;
    playerCol = 0;
    obstacles = generateObstacles();
    timer = 0;
    gameMessage.textContent = '';
    restartButton.style.display = 'none';
    isGameOver = false;
    createGameBoard();
    startTimer();
}

// Add event listeners for player movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') movePlayer('Up');
    if (e.key === 'ArrowDown') movePlayer('Down');
    if (e.key === 'ArrowLeft') movePlayer('Left');
    if (e.key === 'ArrowRight') movePlayer('Right');
});

// Initialize game
createGameBoard();
startTimer();

// Toggle between light and dark phases based on time or conditions
function togglePhase() {
    currentPhase = currentPhase === "light" ? "dark" : "light";
    createGameBoard(); // Refresh the board with the new phase
}

// Example of switching phases every 10 seconds for demonstration
setInterval(togglePhase, 4000); // Toggle every 10 seconds (you can adjust this)
