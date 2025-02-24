const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

//we will need the game container to make it blurry when we display the end menu
const gameContainer = document.getElementById('game-container');

const images = ["bg0.png", "bg1_1.png", "bg2.png", "bg3.png"];
let index = 0;

function changeBackground() {
    document.body.style.backgroundImage = `url('${images[index]}')`;
    index = (index + 1) % images.length; // Loop through images
}

setInterval(changeBackground, 3000); // Change every 3 seconds


const flappyImage = new Image();
flappyImage.src = 'bird.png';

//Game Constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 70; // Increased from 50 to 70
const PIPE_GAP = 125;

//Bird Variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

const pipeImage = new Image();
pipeImage.src = '92b19929-1c18-4e21-8fbc-5638985aac1f.png'; // Replace 'pipe.png' with the path to your pipe image

//Pipe Variables
let pipeX = 500;
let pipeY = canvas.height - 350;

//Score and Highscore Variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let isScored = false;

//control bird with the space key
document.body.onkeyup = function(e) {
    if (e.code === 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

//restart the game with button click
document.getElementById('restart-button').addEventListener('click', function(){
    resetGame();
});

function increaseScore(){
    //increase score when the flappy bird passes the pipes
    if (birdX > pipeX + PIPE_WIDTH && !isScored) {
        score++;
        scoreDiv.innerHTML = score;
        isScored = true;

        //Play score sound
        playScoreSound();
    }

    //reset isScored value
    if (birdX < pipeX + PIPE_WIDTH) {
        isScored = false;
    }
}

function collisionCheck(){
    //Create bounding Boxes for the bird and the pipes

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    //check for collision with topPipeBox
    if (birdBox.x + birdBox.width > topPipeBox.x && 
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    //Check for collision with bottomPipeBox
    if(birdBox.x + birdBox.width > bottomPipeBox.x &&
       birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
       birdBox.y + birdBox.height > bottomPipeBox.y){
        return true;
    }

    //check if the bird hits boundaries
    if(birdY < 0 || birdY + BIRD_HEIGHT > canvas.height){
        return true;
    }

    return false;
}

function showEndMenu(){
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;

    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('high-score').innerHTML = highScore;
    document.getElementById('restart-button').focus();
}

function hideEndMenu(){
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function resetGame(){
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;
    score = 0;

    hideEndMenu();
    loop();
}

function endGame(){
    showEndMenu();
}

function playScoreSound(){
    var audio = new Audio("assets/score_sound.mp3")
    audio.play();
}

function playFailSound(){
    var audio = new Audio("assets/fail_sound.mp3")
    audio.play();
}

function loop(){
    //reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draw flappy bird
    ctx.drawImage(flappyImage, birdX, birdY);

    //Draw pipes using images
    ctx.drawImage(pipeImage, pipeX, pipeY - PIPE_GAP - pipeImage.height, PIPE_WIDTH, pipeImage.height); // Top pipe
    ctx.drawImage(pipeImage, pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, pipeImage.height); // Bottom pipe

    //collision control
    if(collisionCheck()){
        playFailSound();
        endGame();
        return;
    }

    pipeX -= 1.5;

    if(pipeX < -PIPE_WIDTH){
        pipeX = canvas.width;
        pipeY = Math.random() * (canvas.height - PIPE_GAP - 50) + 25; // Adjust this range as needed
    }

    //Apply gravity to bird and let it move
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop);
}

loop();