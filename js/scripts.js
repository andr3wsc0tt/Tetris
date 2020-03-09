var canvas = document.getElementById('Tetris-Canvas');
var ctx = canvas.getContext('2d');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var rotate0 = 0;

canvas.width = 200;
canvas.height = 300;

var x = canvas.width/2;
var y = -10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var zPressed = false;
var xPressed = false;
var brickWidth = 10;
var brickHeight = 10;
var tetrisLength = 6; // canvas.width / brickWidth
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
    constructor(x_, y_, w_, h_, shape_) {
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
        this.shape_name = shape_;
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
function shapeTest(i, j, shape_name)
{
    switch(shape_name){
        case "block":
            return true;
            break;
        case "cross":
            return (i == 0 && j == 1) || (i == 1) || (i == 2 && j == 1);
            break;
        case "L":
            return (i < 3 && j == 1 || i == 2 && j == 2);
            break;
        case "RR-L":
            return (i == 1 && j < 3 || i == 0 && j == 2);
            break;
        case "RRR-L":
            return (i < 3 && j == 1 || i == 0 && j == 0);
            break;
        case "RRRR-L":
            return (i == 1 && j < 3 || i == 2 && j == 0);
            break;
        case "reverse-L":
            return (i < 3 && j == 1 || i == 2 && j == 0);
            break;

    }
}
function shapeTemplate(shape_name, row)
{
    for (let i = 0; i < 3; i++)
    {
        var col = [];
        row[i] = [];
        for (let j = 0; j < 3; j++)
        {
            if (shapeTest(i, j, shape_name))
                col[j] = new brick(x + (j * brickHeight), y + (i * brickWidth), brickWidth, brickHeight, shape_name);
        }
        row[i] = col;
    }
    return row;
}
function createShape(shape_name) {
    var row = [];
    switch (shape_name) {
        case "block":
            row = shapeTemplate("block", row);
            break;
        case "cross":
            shapeTemplate("cross", row);
            break;
        case "L":
            shapeTemplate("L", row);
            break;
        case "RR-L":
            shapeTemplate("RR-L", row);
            break;
        case "RRR-L":
            shapeTemplate("RRR-L", row);
            break;
        case "RRRR-L":
            shapeTemplate("RRRR-L", row);
            break;
        case "reverse-L":
            shapeTemplate("reverse-L", row);
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
function move(shape_item, tetrisBlocks) {
    
    if (rightPressed && downPressed && blockDiagRight(shape_item, tetrisBlocks))
        return;
    
    if (rightPressed && !rightCollision(shape_item) && !leftPressed && !blockCollisionRight(shape_item, tetrisBlocks))
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (shape_item[i][j] != undefined)
                shape_item[i][j].x += 10;
            }
        }
        
    if (leftPressed && downPressed && blockDiagLeft(shape_item, tetrisBlocks))
        return;
    
    if (leftPressed && !leftCollision(shape_item) && !rightPressed && !blockCollisionLeft(shape_item, tetrisBlocks))
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
    if (downPressed && !groundCollision(shape_item) && !blockCollisionTop(shape_item, tetrisBlocks))  
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (shape_item[i][j] != undefined)
                    shape_item[i][j].y += 10;
                }
            }
    if (zPressed)
    {
        selectedShape = rotateShape_CCW(selectedShape);
    }
    if (xPressed)
    {
        selectedShape = rotateShape_CW(selectedShape);
    }
}   
function groundCollision(shape_item)
{
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
            if (shape_item[j][i] != undefined)
            {
                // console.log((shape_item[2][i].y)+shape_item[2][i].h/2);
                if ((shape_item[j][i].y)+(shape_item[j][i].h/2) >= canvas.height - 10) // Not sure why it's 80?
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
        for (let j = 0; j < 3; j++)
        {
            if (shape_item[i][j] != undefined)
            {
                // console.log((shape_item[i][2].x)+(shape_item[i][2].w/2));
                if (shape_item[i][j].x+(shape_item[i][j].w/2) > canvas.width - 10 ) // Not sure why it's 80?
                {
                    return true;
                }
            }
        }
    }
    return false;
}
function leftCollision(shape_item)
{
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if (shape_item[i][j] != undefined)
            {
                // console.log((shape_item[i][0].x)-(shape_item[i][0].w/2));
                if ((shape_item[i][j].x)-(shape_item[i][j].w/2) < 0 ) // Not sure why it's 80?
                {
                    return true;
                }
            }
        }
    }
    return false;
}
// Block collision's can be refactored.

function blockCollisionLeft(selectedShape, tetrisBlocks)
{
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var ys in tetrisBlocks)
                {
                    for (var xs in tetrisBlocks[ys])
                    {
                        var check_shape = tetrisBlocks[ys][xs];
                        if (check_shape != undefined)
                        {
                            console.log("EFT");
                            if ((block.x == check_shape.x+check_shape.w) && ((block.y+block.h) == (check_shape.y+check_shape.h)) && (block.y == check_shape.y))
                            {
                                return true;
                            }
                            else
                                console.error(block.x,check_shape.x,block.x+block.w,check_shape.x+check_shape.w,block.y+block.h,check_shape.y);
                        }
                    }
                }
            }
        }
    }
}
function blockCollisionRight(selectedShape, tetrisBlocks)
{
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var ys in tetrisBlocks)
                {
                    for (var xs in tetrisBlocks[ys])
                    {
                        var check_shape = tetrisBlocks[ys][xs];
                        if (check_shape != undefined)
                        {
                            if ((block.x+block.w == check_shape.x) && ((block.y+block.h) == (check_shape.y+check_shape.h)) && (block.y == check_shape.y))
                            {
                                return true;
                            }
                            // else
                            //     console.error(block.x+block.w, check_shape.x , block.y+block.h, check_shape.y+check_shape.h, block.y, check_shape.y);
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
                for (var ys in tetrisBlocks)
                {
                    for (var xs in tetrisBlocks[ys])
                    {
                        var check_shape = tetrisBlocks[ys][xs];
                        if (check_shape != undefined)
                        {
                            if ((block.x == check_shape.x) && ((block.y+block.h) == (check_shape.y)))
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
function blockDiagLeft(selectedShape, stayShapes)
{
    
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var ys in tetrisBlocks)
                {
                    for (var xs in tetrisBlocks[ys])
                    {
                        var check_shape = tetrisBlocks[ys][xs];
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
function blockDiagRight(selectedShape, stayShapes)
{
    
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var ys in tetrisBlocks)
                {
                    for (var xs in tetrisBlocks[ys])
                    {
                        var check_shape = tetrisBlocks[ys][xs];
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
function selectedDrop(selectedShape, stayShapes)
{
    
    for (let selected_y = 0; selected_y < 3; selected_y++)
    {
        for (let selected_x = 0; selected_x < 3; selected_x++)
        {
            var block = selectedShape[selected_y][selected_x];
            
            if (block != undefined)
            {
                for (var ys in tetrisBlocks)
                {
                    for (var xs in tetrisBlocks[ys])
                    {
                        var check_shape = tetrisBlocks[ys][xs];
                        if (check_shape != undefined)
                        {
                            if ((block.x == check_shape.x) && ((block.x+block.w) == (check_shape.x+check_shape.w)) && (block.y+block.h == check_shape.y))
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
function rotateShape_CCW(selectedShape)
{
    var orig_shape = JSON.parse(JSON.stringify(selectedShape));
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if(selectedShape[i][j] != undefined)
            {
                var x = selectedShape[i][j].x - selectedShape[1][1].x;
                var y = selectedShape[i][j].y - selectedShape[1][1].y;
                var x0 = selectedShape[1][1].x;
                var y0 = selectedShape[1][1].y;

                // console.log(selectedShape[1][1].x, selectedShape[1][1].y, selectedShape[i][j].x, selectedShape[i][j].y, x, y);

                if (-y + x0 < 0 || -y + x0 > canvas.width - 10)
                    return orig_shape;
                if (x + y0 >= canvas.height - 10)
                    return orig_shape; 

                selectedShape[i][j].x = -y;
                selectedShape[i][j].y = x;

                selectedShape[i][j].x += x0;
                selectedShape[i][j].y += y0;

            }
        }
    }
    return selectedShape;
}
function rotateShape_CW(selectedShape)
{
    var orig_shape = JSON.parse(JSON.stringify(selectedShape));
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if(selectedShape[i][j] != undefined)
            {

                var x = selectedShape[i][j].x - selectedShape[1][1].x;
                var y = selectedShape[i][j].y - selectedShape[1][1].y;
                var x0 = selectedShape[1][1].x;
                var y0 = selectedShape[1][1].y;

                // console.log(selectedShape[1][1].x, selectedShape[1][1].y, selectedShape[i][j].x, selectedShape[i][j].y, x, y);

                if (y + x0 < 0 || y + x0 > canvas.width - 10)
                    return orig_shape;
                if (-x + y0 >= canvas.height - 10)
                    return orig_shape; 

                selectedShape[i][j].x = y;
                selectedShape[i][j].y = -x;

                selectedShape[i][j].x += x0;
                selectedShape[i][j].y += y0;

            }
        }
    }
    return selectedShape;
}
function addToTetrisBlocks(selectedShape, tetrisBlocks)
{
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if (selectedShape[i][j] != undefined)
            {
                console.error(selectedShape[i][j].x, selectedShape[i][j].y);
                if (selectedShape[i][j].y in tetrisBlocks)
                {
                    tetrisBlocks[selectedShape[i][j].y][selectedShape[i][j].x] = selectedShape[i][j];
                }
                else
                {
                    tetrisBlocks[selectedShape[i][j].y] = {};
                    tetrisBlocks[selectedShape[i][j].y][selectedShape[i][j].x] = selectedShape[i][j];
                }
            }

        }
    }

    return tetrisBlocks;
}
function drawPlacedShapes(tetrisBlocks)
{
    
    for (var ys in tetrisBlocks)
    {
        for (xs in tetrisBlocks[ys])
        {
            if (tetrisBlocks[ys][xs] != undefined)
            {
                drawBrick(tetrisBlocks[ys][xs])
            }
        }
    }
}
function checkLines(tetrisBlocks)
{
    var num = 0;
    for (var ys in tetrisBlocks)
    {
        if (Object.values(tetrisBlocks[ys]).length == tetrisLength)
        {
            num += 1;
            delete tetrisBlocks[ys];
        }
    
    }
    return num;
}
function rainDown(tetrisBlocks)
{
    for (let i = 0; i < 4; i++)
    {
        for (let height = canvas.height-20; height > 0; height -= 10)
        {
            if (tetrisBlocks[height] != undefined && tetrisBlocks[height+10] == undefined)
            {
                console.log(tetrisBlocks[height], tetrisBlocks[height+10], height);
                tetrisBlocks[height+10] = tetrisBlocks[height];
                for (var xs in tetrisBlocks[height+10])
                {
                    tetrisBlocks[height+10][xs].y += 10;
                }
                delete tetrisBlocks[height];
            }
        }
    }
    return tetrisBlocks;
}
function checkDead(selectedShape)
{
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if (selectedShape[i][j] != undefined)
            {
                if (selectedShape[i][j].y <= 0)
                    return true;
            }
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
// Drop it by level=speed - DONE
// Rotate selectedShape - DONE
// Clear up to 4 full rows - DONE
// Reconcile the canvas size and resolution - DONE
// Don't let shapes spin into each other or out of the map - DONE
// Die - DONE
// TETRIS!!! - DONE 
// MUSIC!!! - DONE

// More Shapes - 4 shapes only 3x3. The long shape needs to get made and considered in all logic :)
// Score
// Add the long piece
// Don't let shapes spin through other shapes

/* User Interface */
// Make the keys adequately responsive
// Differentiate the Blocks colors


var shapes = [];
var tetrisBlocks = {};
var selectedShape = null;
oneTurn = 0; // Timer for how long you can to stay on a block before you stick

function sound(src)
{
    this.sound = document.createElement("audio");
    this.sound.id = "TetrisAudio";
    this.sound.src = src;
    this.sound.loop = true;
    this.sound.addEventListener('ended', function(){
        this.currentTime = 0;
        this.play();
    }, false);
    this.sound.setAttribute("preload", "auto");
    // this.sound.setAttribute("controls", "none");
    // this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

var MyMusic = new sound("./resources/Tetris.mp3")
MyMusic.play();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var clearedLines = 0;

    if (selectedShape == null) // If there is no new shape, create one
    {
        selectedShape = createShape("RRRR-L");
    }

    move(selectedShape, tetrisBlocks); // Let the player move
    drawShape(selectedShape); // Draw that movement
    drawPlacedShapes(tetrisBlocks);

    if (groundCollision(selectedShape) || selectedDrop(selectedShape, shapes)) // If the moving shape has landed
    {
        if (oneTurn > 2) // Time between tetrinos touching and sticking.
        {    
            tetrisBlocks = addToTetrisBlocks(selectedShape, tetrisBlocks); // Store the landed shape
            clearedLines = checkLines(tetrisBlocks); // Clear the full rows
            tetrisBlocks = rainDown(tetrisBlocks);  // Count the rows cleared

            if (clearedLines == 3)
                alert("TETRIS");

            if (checkDead(selectedShape))
                alert("GG");
            
            selectedShape = null; // Reset it
            oneTurn = 0;
        }
        else
            oneTurn += 1;
    }
    else
    {
        perTurnMove(selectedShape); // Drop by a preset amount
        oneTurn = 0;
    }
}

setInterval(draw, 200); // chunky movement
