var canvas = document.getElementById('Tetris-Canvas');
var ctx = canvas.getContext('2d');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var x = canvas.width / 2;
var y = canvas.height / 2;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

function keyDownHandler(e)
{
    if (e.key == "Right" || e.key  == "ArrowRight")
    {
        rightPressed = true;
    }
    if (e.key == "Left" || e.key  == "ArrowLeft")
    {
        leftPressed = true;
    }
    if (e.key == "Up" || e.key  == "ArrowUp")
    {
        upPressed = true;
    }
    if (e.key == "Down" || e.key  == "ArrowDown")
    {
        downPressed = true;
    }
}

function keyUpHandler(e)
{
    if (e.key == "Right" || e.key  == "ArrowRight")
    {
        rightPressed = false;
    }
    if (e.key == "Left" || e.key  == "ArrowLeft")
    {
        leftPressed = false;
    }
    if (e.key == "Up" || e.key  == "ArrowUp")
    {
        upPressed = false;
    }
    if (e.key == "Down" || e.key  == "ArrowDown")
    {
        downPressed = false;
    }
}

function drawBrick()
{
    ctx.beginPath();
    ctx.rect(x, y, 5, 5);
    ctx.fillStyle = "#0095DD";
    // var gradient = ctx.createLinearGradient(0, 0, 170, 0);
    ctx.fill();
    ctx.closePath();
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBrick();

    if (rightPressed)
        x += 1;
    if (leftPressed)
        x -= 1;
    if (upPressed)
        y -= 1;
    if (downPressed)
        y += 1;
 
    requestAnimationFrame(draw);
}

draw();