var canvas = document.getElementById('Tetris-Canvas');
var ctx = canvas.getContext('2d');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var x = canvas.width / 2;
var y = canvas.height / 2;
var rotate0 = 0;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var zPressed = false;
var xPressed = false;

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
    if (e.key == "KeyX" || e.key == "x")
    {
        xPressed = true;
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
    if (e.key == "KeyX" || e.key == "x")
    {
        xPressed = false;
    }
}
class brick 
{
    constructor(x_, y_, w_, h_)
    {
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
    }

    rotate(dir)
    {
        if (dir == "right")
        {
            var hold = this.h;
            this.h = this.w;
            this.w = hold;
        }
        else if (dir == "left")
        {
            this.x = this.x + this.w - this.h;
            var hold = this.h;
            this.h = this.w;
            this.w = hold;
        }
    }

}

function drawBrick(brick)
{
    ctx.beginPath();
    ctx.rect(brick.x, brick.y, brick.w, brick.h);

    var gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x+brick.w, brick.y+brick.h);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "black";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawShape(shape_name, shape)
{
    var row = [];
    switch(shape_name)
    {
        case "block":
            for (let i = 0; i < 3; i++)
            {
                var col = [];
                row[i] = [];
                for (let j = 0; j < 3; j++)
                {
                    col[j] = new brick(x+(j*35), y+(i*35), 35, 35);
                    drawBrick(col[j]);
                }
                row[i] = col;
            }
            shape.push(row);
    }
}

function moveRight(shape_item)
{
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            console.error(shape_item[0][0].x);
            x += 1;
        }
    }
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var shape = [];
    drawShape("block", shape);

    if (rightPressed)
        moveRight(shape[0]);
    if (leftPressed)
        brick1.x -= 1;
    if (upPressed)
        brick1.y -= 1;
    if (downPressed)
        brick1.y += 1;
    if (zPressed)
    {
        brick1.rotate("right");
        zPressed = false;
    }
    if (xPressed)
    {
        brick1.rotate("left");
        xPressed = false;
    }

    requestAnimationFrame(draw);
}

draw();