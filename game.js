var started = false;
var level = 1;
var score = 0;
var targetColor = "";
var lastColor = "";
var timerId = null;
var colors = ["red", "green", "blue", "yellow"];
var baseTime = 1500;
var timeLimit = baseTime;
var highScore = localStorage.getItem("colorGameHighScore") || 0;

$("#highscore").text("High Score: " + highScore);

$("#start-screen").on("click touchstart", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!started) {
        started = true;
        level = 1;
        score = 0;
        timeLimit = baseTime;
        updateUI();
        nextLevel();
        $(this).hide(); 
    }
});

$(".color-btn").on("click touchstart", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!started) return;

    var clicked = $(this).attr("id");

    if (clicked === targetColor) {
        clearTimeout(timerId);
        score++;
        level++;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("colorGameHighScore", highScore);
        }

        updateUI();
        setTimeout(nextLevel, 400);

    } else {
        gameOver("Wrong color!");
    }
});

function adjustTime() {
    if (level <= 5) {
        timeLimit += 100;
    } 
    else if (level > 10) {
        timeLimit -= 80;
        if (timeLimit < 380) timeLimit = 380;
    }
}

function nextLevel() {

    do {
        targetColor = colors[Math.floor(Math.random() * colors.length)];
    } while (targetColor === lastColor);

    lastColor = targetColor;

    $("#status").text("Level " + level + " | Target: " + targetColor.toUpperCase());

    adjustTime();

    timerId = setTimeout(() => {
        gameOver("Time's up!");
    }, timeLimit);
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.volume = 1.0; 
    audio.play().catch(() => {});
}

function updateUI() {
    $("#score").text("Score: " + score);
    $("#highscore").text("High Score: " + highScore);
}


function gameOver(msg) {
    clearTimeout(timerId);
    started = false;
    playSound("wrong");   
    $("#status").text(msg + " — Tap to restart");
    $("#start-screen").show();
}
