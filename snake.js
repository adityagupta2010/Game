
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Size of one square
const rows = canvas.height / box;
const cols = canvas.width / box;

// Snake and food positions
let snake = [{ x: 10 * box, y: 10 * box }];
let food = { 
  x: Math.floor(Math.random() * cols) * box, 
  y: Math.floor(Math.random() * rows) * box 
};
let direction = "RIGHT";
let score = 0;

// Touch position variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Draw the board
function draw() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  snake.forEach((segment) => {
    ctx.fillStyle = "green";
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  // Draw the food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move the snake
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Check collision with food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = { 
      x: Math.floor(Math.random() * cols) * box, 
      y: Math.floor(Math.random() * rows) * box 
    };
  } else {
    snake.pop();
  }

  // Check collision with walls or itself
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
  }

  snake.unshift(head);
}

// Handle user input (keyboard)
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Handle touch input (swipe)
canvas.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

canvas.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0 && direction !== "LEFT") {
      direction = "RIGHT";
    } else if (diffX < 0 && direction !== "RIGHT") {
      direction = "LEFT";
    }
  } else {
    // Vertical swipe
    if (diffY > 0 && direction !== "UP") {
      direction
