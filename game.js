let score = 0;
let gameActive = false;
let platform = document.getElementById('platform');
let gameContainer = document.querySelector('.game-container');
let scoreElement = document.getElementById('score');
let gameOverScreen = document.getElementById('game-over');
let finalScoreElement = document.getElementById('final-score');
let spawnInterval = 2000; // Начальный интервал появления шариков (2 секунды)
let spawnTimer;

// Обработка движения платформы
gameContainer.addEventListener('mousemove', (e) => {
    if (!gameActive) return;
    
    const containerRect = gameContainer.getBoundingClientRect();
    const platformWidth = platform.offsetWidth;
    let newPosition = e.clientX - containerRect.left;
    
    // Ограничение движения платформы в пределах контейнера
    newPosition = Math.max(0, Math.min(newPosition, containerRect.width - platformWidth));
    platform.style.left = newPosition + 'px';
});

// Создание шарика
function createBall() {
    if (!gameActive) return;
    
    const ball = document.createElement('div');
    ball.className = 'ball';
    
    // Случайная позиция по горизонтали
    const containerWidth = gameContainer.offsetWidth;
    const ballWidth = 30;
    const randomX = Math.random() * (containerWidth - ballWidth);
    
    ball.style.left = randomX + 'px';
    ball.style.top = '0px';
    gameContainer.appendChild(ball);
    
    // Анимация падения шарика
    let position = 0;
    const speed = 1.5 + Math.random() * 1.5; // Уменьшенная начальная скорость падения
    
    function animateBall() {
        if (!gameActive) return;
        
        position += speed;
        ball.style.top = position + 'px';
        
        // Проверка столкновения с платформой
        const ballRect = ball.getBoundingClientRect();
        const platformRect = platform.getBoundingClientRect();
        
        if (position >= gameContainer.offsetHeight - platform.offsetHeight - ballWidth) {
            if (ballRect.left < platformRect.right && 
                ballRect.right > platformRect.left) {
                // Шарик пойман
                score += 10;
                scoreElement.textContent = score;
                ball.remove();
                
                // Увеличиваем сложность каждые 50 очков
                if (score % 50 === 0) {
                    spawnInterval = Math.max(1000, spawnInterval - 200); // Уменьшаем интервал, но не меньше 1 секунды
                    clearInterval(spawnTimer);
                    spawnTimer = setInterval(createBall, spawnInterval);
                }
                return;
            }
        }
        
        // Проверка выхода за пределы экрана
        if (position >= gameContainer.offsetHeight) {
            // Игра окончена
            endGame();
            return;
        }
        
        requestAnimationFrame(animateBall);
    }
    
    animateBall();
}

// Запуск игры
function startGame() {
    score = 0;
    gameActive = true;
    spawnInterval = 2000; // Сбрасываем интервал появления шариков
    scoreElement.textContent = score;
    gameOverScreen.classList.add('hidden');
    
    // Очистка всех шариков
    document.querySelectorAll('.ball').forEach(ball => ball.remove());
    
    // Установка начальной позиции платформы
    platform.style.left = '0px';
    
    // Создание новых шариков
    clearInterval(spawnTimer);
    spawnTimer = setInterval(createBall, spawnInterval);
}

// Окончание игры
function endGame() {
    gameActive = false;
    clearInterval(spawnTimer);
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// Автоматический запуск игры при загрузке страницы
window.onload = startGame; 