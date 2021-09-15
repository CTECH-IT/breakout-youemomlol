let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let x = canvas.width/2;
let y = canvas.height-30;

let dx = 7;
let dy = -7;

let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 200;
let paddleX = (canvas.width-paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 6;
let brickColumnCount = 5;
let brickWidth = 85;
let brickHeight = 20;
let brickPadding = 3;
let brickOffsetTop = 30;
let brickOffsetLeft = 23;

let score = 0;

let lives = 3;

//set up array for bricks
let bricks = [];
for (let c=0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r=0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, show: true };
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc (x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "purple";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c < brickColumnCount; c++) {
        for(let r=0; r < brickRowCount; r++) {
            if (bricks[c][r].show == true) {
                let brickX = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight+brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();

    drawBall();

    //change x and y values for ball
    x += dx;
    y += dy;

    //see if it goes off the edge of the board
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) { //ceiling check
        dy = -dy;
    } else if (y + dy > canvas.height-ballRadius) { //floor check
        if (x > paddleX && x < paddleX + paddleWidth) { //paddle check
            dy = -dy;
        } else { //it hit the floor
            lives--;
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval); //needed for brwoswer to end game
    }
}

    //paddle controls
    if(rightPressed) {
        paddleX += 9;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }  
    }
    else if(leftPressed) {
        paddleX -= 9;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    drawPaddle();

    collisionDetection();

    drawScore();

    drawLives();

}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.show == true) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.show = false;
                    score++;
                    if(score == brickRowCount * brickColumnCount) {

                        alert("you win yayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score:" + score, 40, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Lives:" + lives, 390, 20);
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);

let interval = setInterval(draw, 10);