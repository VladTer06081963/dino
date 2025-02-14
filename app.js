/** @format */

const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");

let gameStarted = false;
const bgMusic = new Audio("audio/music.mp3");
const crashSound = new Audio("audio/crash.mp3");
const startSound = new Audio("audio/start.mp3");

cactus.style.animation = "none"; // Остановим анимацию кактуса при загрузке

document.addEventListener("keydown", handleKeyDown);

// Показываем начальное сообщение
showMessage("Нажмите Enter для старта");

function handleKeyDown(event) {
  if (event.code === "Enter" && !gameStarted) {
    startGame();
  } else if (event.code === "Enter" && gameStarted) {
    gameOver();
  } else if (event.code === "Space") {
    jump();
  }
}

function startGame() {
  gameStarted = true;
  removeMessage(); // Удаляем сообщение перед стартом

  startSound.volume = 0.7;
  startSound.play();

  cactus.style.animation = "none";
  setTimeout(() => {
    cactus.style.animation = "cactusMove 3s infinite linear";
  }, 10);

  if (bgMusic.paused) {
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play();
  }

  let isAlive = setInterval(() => {
    if (checkCollision()) {
      clearInterval(isAlive);
      gameOver();
    }
  }, 50);
}

function jump() {
  if (!dino.classList.contains("jump")) {
    dino.classList.add("jump");

    dino.addEventListener(
      "animationend",
      () => {
        dino.classList.remove("jump");
      },
      { once: true }
    );
  }
}

function checkCollision() {
  const dinoStyle = getComputedStyle(dino);
  const cactusStyle = getComputedStyle(cactus);

  let dinoMatrix = dinoStyle.transform;
  let cactusMatrix = cactusStyle.transform;

  let dinoY = 0;
  let cactusX = 800; // Cactus стартует справа

  // Если transform не "none", парсим его
  if (dinoMatrix !== "none") {
    let values = dinoMatrix.match(/matrix\(([^)]+)\)/);
    if (values) {
      let parts = values[1].split(", ");
      dinoY = parseFloat(parts[parts.length - 1]) || 0; // Последний элемент — это translateY
    }
  }

  if (cactusMatrix !== "none") {
    let values = cactusMatrix.match(/matrix\(([^)]+)\)/);
    if (values) {
      let parts = values[1].split(", ");
      cactusX = 800 + parseFloat(parts[parts.length - 2]); // Fix: добавляем 800px (изначальная позиция)
    }
  }

  console.log(`Dino Y: ${dinoY}, Cactus X: ${cactusX}`);

  const dinoOnGround = dinoY >= -10; // Dino на земле (с небольшим запасом)
  return cactusX < 190 && cactusX > 90 && dinoOnGround;
}


function gameOver() {
  gameStarted = false;
  cactus.style.animation = "none";
  cactus.style.transform = "translateX(800px)"; // Возвращаем Cactus вправо

  let fadeOut = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.05;
    } else {
      clearInterval(fadeOut);
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.volume = 0.5;
    }
  }, 100);

  crashSound.volume = 0.7;
  crashSound.play();

  showMessage("Game Over!!! Нажмите Enter для рестарта");
}

// Функция для отображения сообщения
function showMessage(text) {
  let message = document.getElementById("game-message");

  if (!message) {
    message = document.createElement("div");
    message.id = "game-message";
    message.style.position = "absolute";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.padding = "20px";
    message.style.background = "red";
    message.style.color = "white";
    message.style.fontSize = "20px";
    message.style.borderRadius = "10px";
    message.style.textAlign = "center";
    document.body.appendChild(message);
  }

  message.innerText = text;
  message.style.display = "block"; // Показываем сообщение
}

// Функция для удаления сообщения
function removeMessage() {
  const message = document.getElementById("game-message");
  if (message) {
    message.style.display = "none"; // Скрываем сообщение
  }
}
