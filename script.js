// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 800;

class Car {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 12;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        if (this.x > 0) this.x -= this.speed;
    }

    moveRight() {
        if (this.x + this.width < canvas.width) this.x += this.speed;
    }
}

class Obstacle {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += this.speed;
    }
}

const playerCar = new Car(canvas.width / 2 - 100, canvas.height - 70, 50, 100, "blue");
let obstacles = [];
let score = 0;
let gameOver = false;

function createObstacle() {
    const width = Math.random() * 60 + 40;
    const x = Math.random() * (canvas.width - width);
    const speed = 3 + Math.random() * 2;
    obstacles.push(new Obstacle(x, 0 - 100, width, 20, speed));
}

function detectCollision(car, obstacle) {
    return (
        car.x < obstacle.x + obstacle.width &&
        car.x + car.width > obstacle.x &&
        car.y < obstacle.y + obstacle.height &&
        car.y + car.height > obstacle.y
    );
}

function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    playerCar.draw();

    // Move and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.move();
        obstacle.draw();

        if (detectCollision(playerCar, obstacle)) {
            gameOver = true;
            alert(`Game Over! Your Score: ${score}`);
            return;
        }

        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1); // Remove off-screen obstacles
            score++;
        }
    }

    // Add new obstacles periodically
    if (Math.random() < 0.02) createObstacle();

    // Display Score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 25);

    requestAnimationFrame(update);
}

// Keyboard Controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") playerCar.moveLeft();
    if (event.key === "ArrowRight") playerCar.moveRight();
});

update();
