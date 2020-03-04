var canvas = document.getElementById('Tetris-Canvas');
var ctx = canvas.getContext('2d');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var x = canvas.width / 2;
var y = canvas.height / 2;
var rotate = 0;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var zPressed = false;

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
    if (e.key == "KeyZ" || e.key == "z")
    {
        zPressed = true;
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
    if (e.key == "KeyZ" || e.key == "z")
    {
        zPressed = false;
    }
}
class brick 
{
    constructor(x, y, w, h)
    {
        this.x = 5;
        this.y = 5;
        this.w = 25;
        this.h = 25;
    }
}

var brick1 = new brick();

function drawBrick(brick)
{
    ctx.beginPath();
    ctx.rect(brick.x, brick.y, brick.w, brick.h);

    var gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x+brick.w, brick.y+brick.h);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;

    ctx.fill();
    ctx.closePath();
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBrick(brick1);

    if (rightPressed)
        brick1.x += 1;
    if (leftPressed)
        brick1.x -= 1;
    if (upPressed)
        brick1.y -= 1;
    if (downPressed)
        brick1.y += 1;
    if (zPressed)
        rotate = 90;

    requestAnimationFrame(draw);
}

draw();