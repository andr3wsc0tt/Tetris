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
var brickWidth = 10;
var brickHeight = 10;

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
    if (e.key == "KeyZ" || e.key == "z") {
        zPressed = true;
    }
    if (e.key == "KeyX" || e.key == "x") {
        xPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
    if (e.key == "KeyZ" || e.key == "z") {
        zPressed = false;
    }
    if (e.key == "KeyX" || e.key == "x") {
        xPressed = false;
    }
}
class brick {
    constructor(x_, y_, w_, h_) {
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
    }

    rotate(dir) {
        if (dir == "right") {
            var hold = this.h;
            this.h = this.w;
            this.w = hold;
        }
        else if (dir == "left") {
            this.x = this.x + this.w - this.h;
            var hold = this.h;
            this.h = this.w;
            this.w = hold;
        }
    }

}
function drawBrick(brick) {
    ctx.beginPath();
    ctx.rect(brick.x, brick.y, brick.w, brick.h);

    var gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x + brick.w, brick.y + brick.h);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "black";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}
function createShape(shape_name, shapes) {
    var row = [];
    switch (shape_name) {
        case "block":
            for (let i = 0; i < 3; i++) {
                var col = [];
                row[i] = [];
                for (let j = 0; j < 3; j++) {
                    col[j] = new brick(x + (j * brickHeight), y + (i * brickWidth), brickWidth, brickHeight);
                }
                row[i] = col;
            }
            shapes.push(row);
            break;
        case "cross":
            for (let i = 0; i < 3; i++) {
                var col = [];
                row[i] = [];
                for (let j = 0; j < 3; j++) {
                    if ((i == 0 && j == 1) || (i == 1) || (i == 2 && j == 1))
                        col[j] = new brick(x + (j * brickHeight), y + (i * brickWidth), brickWidth, brickHeight);
                }
                row[i] = col;
            }
            shapes.push(row);
            break;
    }
}
function drawShape(shape) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (shape[i][j] != undefined)
                drawBrick(shape[i][j]);
        }
    }
}
function move(shape_item) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (shape_item[i][j] != undefined)
            {
                if (rightPressed && !rightCollision(shape_item))
                    shape_item[i][j].x += 1;
                if (leftPressed && !leftCollision(shape_item))
                    shape_item[i][j].x -= 1;
                if (upPressed)
                    shape_item[i][j].y -= 1;
                if (downPressed && !groundCollision(shape_item))
                    shape_item[i][j].y += 1;
            }
        }
    }
}
function groundCollision(shape_item, shapes)
{
    for (let i = 0; i < 3; i++)
    {
        if (shape_item[2][i] != undefined)
        {
            // console.log((shape_item[2][i].y/2)+shape_item[2][i].h);
            if ((shape_item[2][i].y/2)+shape_item[2][i].h > 80 ) // Not sure why it's 80?
            {
                return true;
            }
        }
    }
    return false;
}

function rightCollision(shape_item)
{
    for (let i = 0; i < 3; i++)
    {
        if (shape_item[i][2] != undefined)
        {
            console.log((shape_item[i][2].x)+(shape_item[i][2].w/2));
            if (shape_item[i][2].x+(shape_item[i][2].w/2) > 295 ) // Not sure why it's 80?
            {
                return true;
            }
        }
    }
    return false;
}

function leftCollision(shape_item)
{
    for (let i = 0; i < 3; i++)
    {
        if (shape_item[i][0] != undefined)
        {
            console.log((shape_item[i][0].x)-(shape_item[i][0].w/2));
            if ((shape_item[i][0].x)-(shape_item[i][0].w/2) < 0 ) // Not sure why it's 80?
            {
                return true;
            }
        }
    }
    return false;
}

// Create a random shape
// Choose a random x value thats JUST below y=0
// Drop it by level=speed.
// Once it collides with anything(ground or block) add to placed blocks and repeat

var dy = -1; // falling
function play()
{
    if (selectedShape == null) // If there is no new shape, create one
    {
        createShape("cross", shapes);
    }

    if (collision(selectedShape, shapes)) // If it collides with another shape or the ground
    {
        shapes.push(selectedShape); // Save it to the inplay shapes
        selectedShape = null; // Make it null
    }

    checkWin();

}

var shapes = [];
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createShape("cross", shapes);
    drawShape(shapes[0]); 
    move(shapes[0]);

    if (zPressed) {
        brick1.rotate("right");
        zPressed = false;
    }
    if (xPressed) {
        brick1.rotate("left");
        xPressed = false;
    }

    requestAnimationFrame(draw);
}

draw();