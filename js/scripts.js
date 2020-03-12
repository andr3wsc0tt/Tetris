var canvas = document.getElementById('Tetris-Canvas');
var ctx = canvas.getContext('2d');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

canvas.width = 200;
canvas.height = 300;

var x = canvas.width / 2;
var y = -10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var zPressed = false;
var xPressed = false;
var pPressed = false;
var brickWidth = 10;
var brickHeight = 10;
var tetrisLength = 20; // canvas.width / brickWidth
var dy = 0; // falling

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
    if (e.key == "KeyP" || e.key == "p") {
        pPressed = true;
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
    if (e.key == "KeyP" || e.key == "p") {
        pPressed = false;
    }
}
class brick {
    constructor(x_, y_, w_, h_, shape_, dim_) {
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
    }
    drawBrick = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);

        var gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        ctx.fillStyle = gradient;
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

class Shape {


    constructor(shape_, dim_) {
        this.shape_name = shape_;
        this.dim = dim_
        this.row = [];

        this.createShape(this.shape_name);
    }

    shapeTest = function (i, j) {
        switch (this.shape_name) {
            case "block":
                return (i > 0 && j > 0);
                break;
            case "L":
                return (i < this.dim && j == 1 || i == 2 && j == 2);
                break;
            case "reverse-L":
                return (i < this.dim && j == 1 || i == 2 && j == 0);
                break;
            case "z":
                return (i == 1 && j < 2 || i == 2 && j > 0);
                break;
            case "s":
                return (i == 1 && j > 0 || i == 2 && j < 2);
                break;
            case "t":
                return (i == 1 && j == 1 || i == 2);
                break;
            case "I":
                return (i == 1);
                break;

        }
    }

    buildShape = function () {
        for (let i = 0; i < this.dim; i++) {
            var col = [];
            this.row[i] = [];
            for (let j = 0; j < this.dim; j++) {
                if (this.shapeTest(i, j))
                    col[j] = new brick(x + (j * brickHeight), y + (i * brickWidth), brickWidth, brickHeight);
            }
            this.row[i] = col;
        }
    }

    createShape = function () {
        var row = [];
        switch (this.shape_name) {
            case "block":
                this.buildShape("block", this.row);
                break;
            case "L":
                this.buildShape("L", this.row);
                break;
            case "reverse-L":
                this.buildShape("reverse-L", this.row);
                break;
            case "z":
                this.buildShape("z", this.row);
                break;
            case "s":
                this.buildShape("s", this.row);
                break;
            case "t":
                this.buildShape("t", this.row);
                break;
            case "I":
                this.buildShape("I", this.row);
                break;
        }
    }

    draw = function () {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined)
                    this.row[i][j].drawBrick();
            }
        }
    }

    move = function (tetrisBlocks) {
        if (rightPressed && downPressed && this.blockDiagRight(tetrisBlocks))
            return;

        if (rightPressed && !this.rightCollision() && !leftPressed && !this.blockCollisionRight(tetrisBlocks))
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined)
                        this.row[i][j].x += 10;
                }
            }

        if (leftPressed && downPressed && this.blockDiagLeft(tetrisBlocks))
            return;

        if (leftPressed && !this.leftCollision() && !rightPressed && !this.blockCollisionLeft(tetrisBlocks))
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined)
                        this.row[i][j].x -= 10;
                }
            }
        if (upPressed)
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined)
                        this.row[i][j].y -= 10;
                }
            }
        if (downPressed && !this.groundCollision() && !this.blockCollisionTop(tetrisBlocks))
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined)
                        this.row[i][j].y += 10;
                }
            }
        if (zPressed) {
            this.rotateShape_CCW(tetrisBlocks);
        }
        if (xPressed) {
            this.rotateShape_CW(tetrisBlocks);
        }
        if (pPressed) {
            dy = Math.abs(dy - 10);
        }
    }
    groundCollision = function () {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++)
                if (this.row[j][i] != undefined) {
                    // console.log((this.row[2][i].y)+this.row[2][i].h/2);
                    if ((this.row[j][i].y) + (this.row[j][i].h / 2) >= canvas.height - 10) // Not sure why it's 80?
                    {
                        return true;
                    }
                }
        }
        return false;
    }
    rightCollision = function () {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined) {
                    // console.log((this.row[i][2].x)+(this.row[i][2].w/2));
                    if (this.row[i][j].x + (this.row[i][j].w / 2) > canvas.width - 10) // Not sure why it's 80?
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    leftCollision = function () {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined) {
                    // console.log((this.row[i][0].x)-(this.row[i][0].w/2));
                    if ((this.row[i][j].x) - (this.row[i][j].w / 2) < 0) // Not sure why it's 80?
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    blockCollisionLeft = function (tetrisBlocks) {
        for (let selected_y = 0; selected_y < this.dim; selected_y++) {
            for (let selected_x = 0; selected_x < this.dim; selected_x++) {
                var block = this.row[selected_y][selected_x];

                if (block != undefined) {
                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var check_shape = tetrisBlocks[ys][xs];
                            if (check_shape != undefined) {
                                if ((block.x == check_shape.x + check_shape.w) && ((block.y + block.h) == (check_shape.y + check_shape.h)) && (block.y == check_shape.y)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    blockCollisionRight = function (tetrisBlocks) {
        for (let selected_y = 0; selected_y < this.dim; selected_y++) {
            for (let selected_x = 0; selected_x < this.dim; selected_x++) {
                var block = this.row[selected_y][selected_x];

                if (block != undefined) {
                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var check_shape = tetrisBlocks[ys][xs];
                            if (check_shape != undefined) {
                                if ((block.x + block.w == check_shape.x) && ((block.y + block.h) == (check_shape.y + check_shape.h)) && (block.y == check_shape.y)) {
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
    blockCollisionTop = function (stayShapes) {
        for (let selected_y = 0; selected_y < this.dim; selected_y++) {
            for (let selected_x = 0; selected_x < this.dim; selected_x++) {
                var block = this.row[selected_y][selected_x];

                if (block != undefined) {
                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var check_shape = tetrisBlocks[ys][xs];
                            if (check_shape != undefined) {
                                if ((block.x == check_shape.x) && ((block.y + block.h) == (check_shape.y))) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    blockDiagLeft = function (stayShapes) {

        for (let selected_y = 0; selected_y < this.dim; selected_y++) {
            for (let selected_x = 0; selected_x < this.dim; selected_x++) {
                var block = this.row[selected_y][selected_x];

                if (block != undefined) {
                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var check_shape = tetrisBlocks[ys][xs];
                            if (check_shape != undefined) {
                                if ((block.y + block.h == check_shape.y) && (block.x == check_shape.x + check_shape.w)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    blockDiagRight = function (stayShapes) {

        for (let selected_y = 0; selected_y < this.dim; selected_y++) {
            for (let selected_x = 0; selected_x < this.dim; selected_x++) {
                var block = this.row[selected_y][selected_x];

                if (block != undefined) {
                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var check_shape = tetrisBlocks[ys][xs];
                            if (check_shape != undefined) {
                                if ((block.y + block.h == check_shape.y) && (block.x + block.w == check_shape.x)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    selectedDrop = function (stayShapes) {

        for (let selected_y = 0; selected_y < this.dim; selected_y++) {
            for (let selected_x = 0; selected_x < this.dim; selected_x++) {
                var block = this.row[selected_y][selected_x];

                if (block != undefined) {
                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var check_shape = tetrisBlocks[ys][xs];
                            if (check_shape != undefined) {
                                if ((block.x == check_shape.x) && ((block.x + block.w) == (check_shape.x + check_shape.w)) && (block.y + block.h == check_shape.y)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    perTurnMove = function () {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined)
                    this.row[i][j].y += dy;
            }
        }
    }
    rotateShape_CCW = function (tetrisBlocks) {
        var pX = this.row[1][1].x + this.row[1][1].w / 2; // middle point x
        var pY = this.row[1][1].y + this.row[1][1].h / 2; // middle point y

        var orig_shape = JSON.parse(JSON.stringify(this.row));
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined) {
                    var psW = this.row[i][j].w / 2;
                    var psH = this.row[i][j].h / 2;

                    var SSx = this.row[i][j].x + psW;
                    var SSy = this.row[i][j].y + psH;

                    var x = SSx - pX;
                    var y = SSy - pY;

                    var x0 = pX;
                    var y0 = pY;

                    if (-y + x0 < 0 || -y + x0 > canvas.width - 10)
                        return orig_shape;
                    if (x + y0 >= canvas.height - 10)
                        return orig_shape;

                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var placedBlock = tetrisBlocks[ys][xs];

                            if (-y + x0 == placedBlock.x && x + y0 == placedBlock.y)
                                return orig_shape;

                        }
                    }

                    this.row[i][j].x = -y - psW;
                    this.row[i][j].y = x - psH;

                    this.row[i][j].x += x0;
                    this.row[i][j].y += y0;

                }
            }
        }
        return this.row;
    }
    rotateShape_CW = function () {
        /*
            set a point P as the centroid
        */

        var pX = this.row[1][1].x + (this.row[1][1].w / 2);
        var pY = this.row[1][1].y + (this.row[1][1].h / 2);

        var orig_shape = JSON.parse(JSON.stringify(this.row));
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined) {

                    var psW = this.row[i][j].w / 2;
                    var psH = this.row[i][j].h / 2;

                    var SSx = this.row[i][j].x + psW;
                    var SSy = this.row[i][j].y + psH;

                    var x = SSx - pX;
                    var y = SSy - pY;

                    var x0 = pX;
                    var y0 = pY;

                    if (y + x0 < 0 || y + x0 > canvas.width - 10)
                        return orig_shape;
                    if (-x + y0 >= canvas.height - 10)
                        return orig_shape;

                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var placedBlock = tetrisBlocks[ys][xs];

                            if (y + x0 == placedBlock.x && -x + y0 == placedBlock.y)
                                return orig_shape;

                        }
                    }

                    this.row[i][j].x = y - psW;
                    this.row[i][j].y = -x - psH;

                    this.row[i][j].x += x0;
                    this.row[i][j].y += y0;

                }
            }
        }
        return this.row;
    }
    addToTetrisBlocks = function (tetrisBlocks) {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined) {
                    if (this.row[i][j].y in tetrisBlocks) {
                        tetrisBlocks[this.row[i][j].y][this.row[i][j].x] = this.row[i][j];
                    }
                    else {
                        tetrisBlocks[this.row[i][j].y] = {};
                        tetrisBlocks[this.row[i][j].y][this.row[i][j].x] = this.row[i][j];
                    }
                }

            }
        }

        return tetrisBlocks;
    }

    checkDead = function () {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined) {
                    if (this.row[i][j].y <= 0)
                        return true;
                }
            }
        }
    }
}

// Block collision's can be refactored.

function drawPlacedShapes(tetrisBlocks) {

    for (var ys in tetrisBlocks) {
        for (xs in tetrisBlocks[ys]) {
            if (tetrisBlocks[ys][xs] != undefined) {
                tetrisBlocks[ys][xs].drawBrick();
            }
        }
    }
}
function checkLines(tetrisBlocks) {
    var num = 0;
    for (var ys in tetrisBlocks) {
        if (Object.values(tetrisBlocks[ys]).length == tetrisLength) {
            num += 1;
            delete tetrisBlocks[ys];
        }

    }
    return num;
}
function rainDown(tetrisBlocks) {
    for (let i = 0; i < 4; i++) {
        for (let height = canvas.height - 20; height > 0; height -= 10) {
            if (tetrisBlocks[height] != undefined && tetrisBlocks[height + 10] == undefined) {
                console.log(tetrisBlocks[height], tetrisBlocks[height + 10], height);
                tetrisBlocks[height + 10] = tetrisBlocks[height];
                for (var xs in tetrisBlocks[height + 10]) {
                    tetrisBlocks[height + 10][xs].y += 10;
                }
                delete tetrisBlocks[height];
            }
        }
    }
    return tetrisBlocks;
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
// More Shapes - 4 shapes only 3x3. - DONE
// Don't let shapes spin through other shapes - DONE
// Spins from the center of a 3x3 piece - Done

// Add the long piece
// The long shape needs to get made and considered in all logic :)
// Score
// Make the spin central to the specific shape

/* User Interface */
// Make the keys adequately responsive!!!
// Differentiate the Blocks colors


var shapes = ["t", "s", "z", "L", "reverse-L", "block", "I"];
var tetrisBlocks = {};
var selectedShape = null;
oneTurn = 0; // Timer for how long you can to stay on a block before you stick

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.id = "TetrisAudio";
    this.sound.src = src;
    this.sound.loop = true;
    this.sound.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    this.sound.setAttribute("preload", "auto");
    // this.sound.setAttribute("controls", "none");
    // this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

var MyMusic = new sound("./resources/Tetris.mp3")
//MyMusic.play();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var clearedLines = 0;

    if (selectedShape == null) // If there is no new shape, create one
    {
        var randShape = shapes[Math.floor(Math.random() * shapes.length)];
        selectedShape = new Shape(randShape, 3);
    }

    selectedShape.move(tetrisBlocks); // Let the player move
    selectedShape.draw(); // Draw that movement
    drawPlacedShapes(tetrisBlocks);

    if (selectedShape.groundCollision() || selectedShape.selectedDrop()) // If the moving shape has landed
    {
        if (oneTurn > 2) // Time between tetrinos touching and sticking.
        {
            tetrisBlocks = selectedShape.addToTetrisBlocks(tetrisBlocks); // Store the landed shape
            clearedLines = checkLines(tetrisBlocks); // Clear the full rows
            tetrisBlocks = rainDown(tetrisBlocks);  // Count the rows cleared

            if (clearedLines == 3)
                alert("TETRIS");

            if (selectedShape.checkDead())
                alert("GG");

            selectedShape = null; // Reset it
            oneTurn = 0;
        }
        else
            oneTurn += 1;
    }
    else {
        selectedShape.perTurnMove(); // Drop by a preset amount
        oneTurn = 0;
    }
}

setInterval(draw, 200); // chunky movement
