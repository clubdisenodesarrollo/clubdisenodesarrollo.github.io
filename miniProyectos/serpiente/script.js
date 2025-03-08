// JavaScript para el juego de la serpiente
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };

let dx = box;
let dy = 0;

function drawSnake() {
  snake.forEach((segment) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(segment.x, segment.y, box, box);
  });
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);
  ctx.strokeStyle = 'darkred';
  ctx.strokeRect(food.x, food.y, box, box);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  moveSnake();

  if (checkCollision()) {
    clearInterval(game);
    alert('Game Over!');
    location.reload();
  }
}

function checkCollision() {
  const head = snake[0];

  return (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
  );
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && dx !== box) {
    dx = -box;
    dy = 0;
  } else if (e.key === 'ArrowRight' && dx !== -box) {
    dx = box;
    dy = 0;
  } else if (e.key === 'ArrowUp' && dy !== box) {
    dx = 0;
    dy = -box;
  } else if (e.key === 'ArrowDown' && dy !== -box) {
    dx = 0;
    dy = box;
  }
});

const game = setInterval(draw, 150);
