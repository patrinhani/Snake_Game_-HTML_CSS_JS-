const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Quarda a maior pontuação
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
   
// Passando um valor aleatório de 1 a 30 como posição de comida
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
   
// Limpando o cronômetro e recarregando a página no fim do jogo
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = e => {
    // Alterando o valor da velocidade com base no pressionamento da tecla
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}


// Chamando changeDirection em cada clique de tecla e passando o valor do conjunto de dados da chave como um objeto
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Verificando se a cobra atingiu a comida
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); 
        // Empurrando a posição do alimento para o array do corpo da cobra
        score++; 
        // incrementa pontuação em 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    
// Atualizando a posição da cabeça da cobra com base na velocidade atual
    snakeX += velocityX;
    snakeY += velocityY;
    
    // 
// Deslocando para frente os valores dos elementos no corpo da cobra em um
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // 
    // Configurando o primeiro elemento do corpo da cobra para a posição atual da cobra

  
// Verificando se a cabeça da cobra está fora da parede, em caso afirmativo, definindo gameOver como verdadeiro
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
// Adicionando um div para cada parte do corpo da cobra
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Verificando se a cabeça da cobra atingiu o corpo, em caso afirmativo, defina gameOver como verdadeiro
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);