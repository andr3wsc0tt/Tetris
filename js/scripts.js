var canvas = document.getElementById('Tetris-Canvas');
var ctx = canvas.getContext('2d');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var x = 0;
var y = 0;
var rotate0 = 0;

console.log(canvas.width, canvas.height);

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var zPressed = false;
var xPressed = false;
var brickWidth = 10;
var brickHeight = 10;
var dy = 10; // falling

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
function createShape(shape_name) {
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
            break;
    }
    return row;
}
function drawShape(shape) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (shape[i][j] != undefined)
                drawBrick(shape[i][j]);
        }
    }
}
function move(shape_item, shapes) {
    
    if (rightPressed && downPressed && blockDiagRight(shape_item, shapes))
        return;
    
    if (rightPressed && !rightCollision(shape_item) && !leftPressed && !blockCollisionRight(shape_item, shapes))
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (shape_item[i][j] != undefined)
                shape_item[i][j].x += 10;
            }
        }
        
    if (leftPressed && downPressed && blockDiagLeft(shape_item, shapes))
        return;
    
    if (leftPressed && !leftCollision(shape_item) && !rightPressed && !blockCollisionLeft(shape_item, shapes))
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (shape_item[i][j] != undefined)
                shape_item[i][j].x -= 10;
        }
    }
    if (upPressed)
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (shape_item[i][j] != undefined)
                    shape_item[i][j].y -= 10;
                }
            }
    if (downPressed && !groundCollision(shape_item) && !blockCollisionTop(shape_item, shapes))  
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (shape_item[i][j] != undefined)
                    shape_item[i][j].y += 10;
                }
            }
    // if (downPressed && rightPressed)
    //     console.log("R-DIAG");
}
function groundCollision(shape_item)
{
    for (let i = 0; i < 3; i++)
    {
        if (shape_item[2][i] != undefined)
        {
            // console.log((shape_item[2][i].y)+shape_item[2][i].h/2);
            if ((shape_item[2][i].y)+(shape_item[2][i].h/2) >= 145 ) // Not sure why it's 80?
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
            // console.log((shape_item[i][2].x)+(shape_item[i][2].w/2));
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
            // console.log((shape_item[i][0].x)-(shape_item[i][0].w/2));
            if ((shape_item[i][0].x)-(shape_item[i][0].w/2) < 0 ) // Not sure why it's 80?
            {
                return true;
            }
        }
    }
    return false;
}
// Block collision's can be refactored.
function blockCollisionLeft(selectedShape, stayShapes)
{
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var shape in stayShapes)
                {
                    var whole_shape = stayShapes[shape];
                    for (let shape_y = 0; shape_y < 3; shape_y++)
                    {
                        for (let shape_x = 0; shape_x < 3; shape_x++)
                        {   
                            var check_shape = whole_shape[shape_y][shape_x];
                            if (check_shape != undefined)
                            {
                                if ((block.x == check_shape.x+check_shape.w) && ((block.y+block.h) == (check_shape.y+check_shape.h)) && (block.y == check_shape.y))
                                {
                                    return true;
                                }
                                // else
                                //     console.error([shape_x, shape_y], [selected_x, selected_y], block.x,check_shape.x,block.x+block.w,check_shape.x+check_shape.w,block.y+block.h,check_shape.y);
                            }
                        }
                    }
                }
            }
        }
    }
}
function blockCollisionRight(selectedShape, stayShapes)
{
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var shape in stayShapes)
                {
                    var whole_shape = stayShapes[shape];
                    for (let shape_y = 0; shape_y < 3; shape_y++)
                    {
                        for (let shape_x = 0; shape_x < 3; shape_x++)
                        {   
                            var check_shape = whole_shape[shape_y][shape_x];
                            if (check_shape != undefined)
                            {
                                if ((block.x+block.w == check_shape.x) && ((block.y+block.h) == (check_shape.y+check_shape.h)) && (block.y == check_shape.y))
                                {
                                    return true;
                                }
                                // else
                                //     console.error([shape_x, shape_y], [selected_x, selected_y], block.x,check_shape.x,block.x+block.w,check_shape.x+check_shape.w,block.y+block.h,check_shape.y);
                            }
                        }
                    }
                }
            }
        }
    }
}
function blockCollisionTop(selectedShape, stayShapes)
{
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var shape in stayShapes)
                {
                    var whole_shape = stayShapes[shape];
                    for (let shape_y = 0; shape_y < 3; shape_y++)
                    {
                        for (let shape_x = 0; shape_x < 3; shape_x++)
                        {   
                            var check_shape = whole_shape[shape_y][shape_x];
                            if (check_shape != undefined)
                            {
                                if ((block.x == check_shape.x) && ((block.y+block.h) == (check_shape.y)))
                                {
                                    return true;
                                }
                                // else
                                //     console.error([shape_x, shape_y], [selected_x, selected_y], block.x,check_shape.x,block.x+block.w,check_shape.x+check_shape.w,block.y+block.h,check_shape.y);
                            }
                        }
                    }
                }
            }
        }
    }
}
function blockDiagLeft(selectedShape, stayShapes)
{
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var shape in stayShapes)
                {
                    var whole_shape = stayShapes[shape];
                    for (let shape_y = 0; shape_y < 3; shape_y++)
                    {
                        for (let shape_x = 0; shape_x < 3; shape_x++)
                        {   
                            var check_shape = whole_shape[shape_y][shape_x];
                            if (check_shape != undefined)
                            {
                                if ((block.y+block.h == check_shape.y) && (block.x == check_shape.x+check_shape.w))
                                {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function blockDiagRight(selectedShape, stayShapes)
{
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var shape in stayShapes)
                {
                    var whole_shape = stayShapes[shape];
                    for (let shape_y = 0; shape_y < 3; shape_y++)
                    {
                        for (let shape_x = 0; shape_x < 3; shape_x++)
                        {   
                            var check_shape = whole_shape[shape_y][shape_x];
                            if (check_shape != undefined)
                            {
                                if ((block.y+block.h == check_shape.y) && (block.x+block.w == check_shape.x))
                                {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function selectedDrop(selectedShape, stayShapes)
{
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var shape in stayShapes)
                {
                    var whole_shape = stayShapes[shape];
                    for (let shape_y = 0; shape_y < 3; shape_y++)
                    {
                        for (let shape_x = 0; shape_x < 3; shape_x++)
                        {   
                            var check_shape = whole_shape[shape_y][shape_x];
                            if (check_shape != undefined)
                            {
                                if ((block.x == check_shape.x) && ((block.x+block.w) == (check_shape.x+check_shape.w)) && (block.y+block.h == check_shape.y))
                                {
                                    return true;
                                }
                                // else
                                //     console.error([shape_x, shape_y], [selected_x, selected_y], block.x,check_shape.x,block.x+block.w,check_shape.x+check_shape.w,block.y+block.h,check_shape.y);
                            }
                        }
                    }
                }
            }
        }
    }
} 
function perTurnMove(selectedShape)
{
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if (selectedShape[i][j] != undefined)
                selectedShape[i][j].y += dy;
        }
    }
}

// Create a random shape - DONE
// Choose a random x value thats JUST below y=0 - DONE
// Once it collides with ground add to placed blocks and repeat - DONE
// Once it collides with other blocks place and repeat - DONE
// Block left and right collisions - DONE
// Block diag collisions - DONE
// Give one turn before drop stick - DONE

// Drop it by level=speed.

// More Shapes
// Die
// Score
// TETRIS!!!

var shapes = [];
var selectedShape = null;
oneTurn = 0; // Timer for how long you can to stay on a block before you stick

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedShape == null) // If there is no new shape, create one
    {
        selectedShape = createShape("cross");
    }
    
    move(selectedShape, shapes); // Let the player move
    drawShape(selectedShape); // Draw that movement

    for (var stayShapes in shapes) // Draw all the shapes that have landed
    {
        drawShape(shapes[stayShapes]); 
    }

    if (groundCollision(selectedShape) || selectedDrop(selectedShape, shapes)) // If the moving shape has landed
    {
        if (oneTurn > 2)
        {
            shapes.push(selectedShape); // Save it to the board
            selectedShape = null; // Reset it
            oneTurn = 0;
        }
        else
            oneTurn += 1;
    }
    else
    {
        perTurnMove(selectedShape);
        oneTurn = 0;
    }
}

setInterval(draw, 200); // chunky movement
