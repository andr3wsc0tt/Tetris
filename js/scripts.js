var canvas = document.getElementById('Tetris-Canvas');
var ctx = canvas.getContext('2d');

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

canvas.width = 250;
canvas.height = 550;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var xPressed = false;
var cPressed = false;
var pPressed = false;
var brickWidth = canvas.width / 10;
var brickHeight = brickWidth;
var tetrisLength = canvas.width / brickWidth; // canvas.width / brickWidth
var dy = brickWidth; // falling

var x = canvas.width / 2;
var y = -brickWidth;

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
    if (e.key == "KeyX" || e.key == "x") {
        xPressed = true;
    }
    if (e.key == "KeyC" || e.key == "c") {
        cPressed = true;
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
    if (e.key == "KeyX" || e.key == "x") {
        xPressed = false;
    }
    if (e.key == "KeyC" || e.key == "c") {
        cPressed = false;
    }
    if (e.key == "KeyP" || e.key == "p") {
        pPressed = false;
    }
}

function drawGrid() {
    for (let i = brickWidth; i < canvas.width; i += brickWidth) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    for (let i = brickWidth; i < canvas.height; i += brickWidth) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}
class brick {
    constructor(x_, y_, w_, h_, shape_) {
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
        this.shape = shape_;
    }
    drawBrick = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);

        var gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);

        ["t", "s", "z", "L", "reverse-L", "block", "I"];
        switch (this.shape) {
            case "I":
                gradient.addColorStop("0", "#0AC6FC");
                gradient.addColorStop("0.5", "#02E6E0");
                gradient.addColorStop("1.0", "#0582F5");
                break;
            case "block": // no pop
                gradient.addColorStop("0", "#E8E40E");
                gradient.addColorStop("0.5", "#FFEB1B");
                gradient.addColorStop("1.0", "#FCFF1C");
                break;
            case "t":
                gradient.addColorStop("0", "#E00CF7");
                gradient.addColorStop("0.5", "#B000F1");
                gradient.addColorStop("1.0", "#F000E8");
                break;
            case "L":
                gradient.addColorStop("0", "#FF9B00");
                gradient.addColorStop("0.5", "#FF8C00");
                gradient.addColorStop("1.0", "#E8660C");
                break;
            case "reverse-L":
                gradient.addColorStop("0", "#0FFFCE");
                gradient.addColorStop("0.5", "#0137FF");
                gradient.addColorStop("1.0", "#CA0DFF");
                break;
            case "s":
                gradient.addColorStop("0", "#FFED14");
                gradient.addColorStop("0.5", "#00D10F");
                gradient.addColorStop("1.0", "#08F5FF");
                break;
            case "z":
                gradient.addColorStop("0", "magenta");
                gradient.addColorStop("0.5", "red");
                gradient.addColorStop("1.0", "red");
                break;
        }


        ctx.fillStyle = gradient;
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

class Shape {

    constructor(shape_) {
        this.shape_name = shape_;

        if (this.shape_name == "I")
            this.dim = 4;
        else
            this.dim = 3;

        this.row = [];
        switch (this.shape_name) {
            case "L":
                this.spawn = 1;
                break;
            case "reverse-L":
                this.spawn = 3;
                break;
            case "z":
                this.spawn = 2;
                break;
            case "s":
                this.spawn = 2;
                break;
            case "t":
                this.spawn = 0;
                break;
            case "I":
                this.spawn = 0;
                break;
        }

        this.createShape();
    }

    copyMe = function () {
        var retShape = [];
        for (let i = 0; i < this.dim; i++) {
            retShape[i] = [];
            var col = [];
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined) {
                    col[i] = new brick(this.row[i][j].x, this.row[i][j].y, this.row[i][j].w, this.row[i][j].h);
                }
            }
            retShape[i].push(col);
        }
        return retShape;
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
                return (i == 1 || j == 1 && i == 0);
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
                    col[j] = new brick(x + (j * brickHeight), y + (i * brickWidth), brickWidth, brickHeight, this.shape_name);
            }
            this.row[i] = col;
        }
    }

    createShape = function () {
        switch (this.shape_name) {
            case "block":
                this.buildShape();
                break;
            case "L":
                this.buildShape();
                break;
            case "reverse-L":
                this.buildShape();
                break;
            case "z":
                this.buildShape();
                break;
            case "s":
                this.buildShape();
                break;
            case "t":
                this.buildShape();
                break;
            case "I":
                this.buildShape();
                break;
        }
    }

    draw = function () {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++) {
                if (this.row[i][j] != undefined) {
                    this.row[i][j].drawBrick();
                }
            }
        }
    }

    move = function (tetrisBlocks) {

        if (rightPressed && downPressed && this.blockDiagRight(tetrisBlocks)) {
            return;
        }

        if (rightPressed && !this.rightCollision() && !leftPressed && !this.blockCollisionRight(tetrisBlocks))
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined)
                        this.row[i][j].x += brickWidth;
                }
            }

        if (leftPressed && downPressed && this.blockDiagLeft(tetrisBlocks)) {
            return;
        }

        if (leftPressed && !this.leftCollision() && !rightPressed && !this.blockCollisionLeft(tetrisBlocks)) {
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined)
                        this.row[i][j].x -= brickWidth;
                }
            }
        }
        if (upPressed)
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined)
                        this.row[i][j].y -= brickHeight;
                }
            }

        if (downPressed && !this.groundCollision() && !this.blockCollisionTop(tetrisBlocks)) {
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined)
                        this.row[i][j].y += brickHeight;
                }
            }
        }

        if (xPressed && !this.checkRotateShape_CCW(tetrisBlocks)) {
            this.rotateShape_CCW();
        }
        else if (xPressed && this.checkRotateShape_CCW(tetrisBlocks)) {
            var x_tran = null, y_tran = null;
            [x_tran, y_tran] = this.checkWallKicks_CCW();

            if (x_tran != null && y_tran != null) {
                console.log(x_tran, y_tran);
                this.rotateShape_CCW(x_tran, y_tran);
            }
        }

        if (cPressed && !this.checkRotateShape_CW(tetrisBlocks)) {
            this.rotateShape_CW();
        }
        else if (cPressed && this.checkRotateShape_CW(tetrisBlocks)) {
            var x_tran = null, y_tran = null;
            [x_tran, y_tran] = this.checkWallKicks_CW();

            if (x_tran != null && y_tran != null) {
                console.log(x_tran, y_tran);
                this.rotateShape_CW(x_tran, y_tran);
            }
        }
        if (pPressed) {
            dy = Math.abs(dy - brickHeight);
        }

    }
    groundCollision = function () {
        for (let i = 0; i < this.dim; i++) {
            for (let j = 0; j < this.dim; j++)
                if (this.row[j][i] != undefined) {
                    // console.log((this.row[2][i].y)+this.row[2][i].h/2);
                    if ((this.row[j][i].y) + (this.row[j][i].h / 2) >= canvas.height - brickHeight) // Not sure why it's 80?
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
                    if (this.row[i][j].x + (this.row[i][j].w / 2) > canvas.width - brickWidth) // Not sure why it's 80?
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
        return false;
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
        return false;
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
        return false;
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
        return false;
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
        return false;
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
        return false;
    }
    perTurnMove = function (dropSpeed) {
        dropSpeed++;
        level = 10 - Math.floor(score / 1000);

        if (dropSpeed > level) // 10 == slow, 1 == super fast
        {
            for (let i = 0; i < this.dim; i++) {
                for (let j = 0; j < this.dim; j++) {
                    if (this.row[i][j] != undefined) {
                        this.row[i][j].y += dy;
                    }
                }
            }
            dropSpeed = 0;
        }
        return dropSpeed;
    }
    checkRotateShape_CCW = function (tetrisBlocks, x_tran = 0, y_tran = 0) {
        if (this.shape_name == "block")
            return true;

        var pX = this.row[1][1].x + this.row[1][1].w / 2 + (x_tran * brickWidth); // middle point x
        var pY = this.row[1][1].y + this.row[1][1].h / 2 + (y_tran * brickWidth); // middle point y

        if (this.shape_name == "I") {
            if (this.row[1][0] != undefined) {
                pX = this.row[1][2].x;
                pY = this.row[1][2].y + this.row[1][2].h;
            }
            else if (this.row[0][2] != undefined) {
                pX = this.row[2][2].x;
                pY = this.row[2][2].y;
            }
            else if (this.row[2][0] != undefined) {
                pX = this.row[2][2].x;
                pY = this.row[2][2].y;
            }
            else if (this.row[0][1] != undefined) {
                pX = this.row[2][1].x + this.row[2][1].w;
                pY = this.row[2][1].y;
            }

        }

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

                    if (-y + x0 < 0 || -y + x0 > canvas.width - brickHeight) {
                        return true;
                    }
                    if (x + y0 > canvas.height - brickHeight) {
                        return true;
                    }

                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var placedBlock = tetrisBlocks[ys][xs];

                            if (-y - psW + x0 == placedBlock.x && x - psH + y0 == placedBlock.y) {
                                return true;
                            }

                        }
                    }
                }
            }
        }
        return false;
    }
    rotateShape_CCW = function (x_tran = 0, y_tran = 0) {
        var pX = this.row[1][1].x + (this.row[1][1].w / 2) + (x_tran * brickWidth); // middle point x
        var pY = this.row[1][1].y + (this.row[1][1].h / 2) + (y_tran * brickWidth); // middle point y

        if (--this.spawn == -1)
            this.spawn = 3;

        if (this.shape_name == "I") {
            if (this.row[1][0] != undefined) {
                pX = this.row[1][2].x + (x_tran * brickWidth);
                pY = this.row[1][2].y + this.row[1][2].h + (y_tran * brickWidth);
            }
            else if (this.row[0][2] != undefined) {
                pX = this.row[2][2].x + (x_tran * brickWidth);
                pY = this.row[2][2].y + (y_tran * brickWidth);
            }
            else if (this.row[2][0] != undefined) {
                pX = this.row[2][2].x + (x_tran * brickWidth);
                pY = this.row[2][2].y + (y_tran * brickWidth);
            }
            else if (this.row[0][1] != undefined) {
                pX = this.row[2][1].x + this.row[2][1].w + (x_tran * brickWidth);
                pY = this.row[2][1].y + (y_tran * brickWidth);
            }

        }

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

                    this.row[i][j].x = -y - psW;
                    this.row[i][j].y = x - psH;

                    this.row[i][j].x += x0;
                    this.row[i][j].y += y0;

                }
            }
        }
    }
    checkRotateShape_CW = function (tetrisBlocks, x_tran = 0, y_tran = 0) {

        if (this.shape_name == "block")
            return true;

        var pX = this.row[1][1].x + (this.row[1][1].w / 2) + (x_tran * brickWidth);
        var pY = this.row[1][1].y + (this.row[1][1].h / 2) + (y_tran * brickWidth);

        if (this.shape_name == "I") {
            if (this.row[1][0] != undefined) {
                pX = this.row[1][2].x;
                pY = this.row[1][2].y + this.row[1][2].h;
            }
            else if (this.row[0][2] != undefined) {
                pX = this.row[2][2].x;
                pY = this.row[2][2].y;
            }
            else if (this.row[2][0] != undefined) {
                pX = this.row[2][2].x;
                pY = this.row[2][2].y;
            }
            else if (this.row[0][1] != undefined) {
                pX = this.row[2][1].x + this.row[2][1].w;
                pY = this.row[2][1].y;
            }

        }


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

                    if (y + x0 < 0 || y + x0 > canvas.width - brickWidth) {
                        return true;
                    }
                    if (-x + y0 >= canvas.height - brickHeight) {
                        return true;
                    }

                    for (var ys in tetrisBlocks) {
                        for (var xs in tetrisBlocks[ys]) {
                            var placedBlock = tetrisBlocks[ys][xs];

                            if (y - psW + x0 == placedBlock.x && -x - psH + y0 == placedBlock.y) {
                                return true;
                            }

                        }
                    }

                }
            }
        }
        return false;
    }
    rotateShape_CW = function (x_tran = 0, y_tran = 0) {

        var pX = this.row[1][1].x + (this.row[1][1].w / 2) + (x_tran * brickWidth);
        var pY = this.row[1][1].y + (this.row[1][1].h / 2) + (y_tran * brickWidth);

        this.spawn = ++this.spawn % 4;

        if (this.shape_name == "I") {
            if (this.row[1][0] != undefined) {
                pX = this.row[1][2].x + (x_tran * brickWidth);
                pY = this.row[1][2].y + this.row[1][2].h + (y_tran * brickWidth);
            }
            else if (this.row[0][2] != undefined) {
                pX = this.row[2][2].x + (x_tran * brickWidth);
                pY = this.row[2][2].y + (y_tran * brickWidth);
            }
            else if (this.row[2][0] != undefined) {
                pX = this.row[2][2].x + (x_tran * brickWidth);
                pY = this.row[2][2].y + (y_tran * brickWidth);
            }
            else if (this.row[0][1] != undefined) {
                pX = this.row[2][1].x + this.row[2][1].w + (x_tran * brickWidth);
                pY = this.row[2][1].y + (y_tran * brickWidth);
            }

        }


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

                    this.row[i][j].x = y - psW;
                    this.row[i][j].y = -x - psH;

                    this.row[i][j].x += x0;
                    this.row[i][j].y += y0;

                }
            }
        }
    }
    checkWallKicks_CCW = function () {
        var x_tran, y_tran;
        var tests = [];
        if (this.shape_name != "I")
            switch (this.spawn) {
                case 0: // 0 -> L
                    tests = [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]];
                    break;
                case 2: // 2 -> R
                    tests = [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]];
                    break;
                case 1: // R -> 0
                    tests = [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]];
                    break;
                case 3: // L -> 2
                    tests = [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]];
                    break;
            }
        else
            switch (this.spawn) {
                case 0: // 0 -> L
                    tests = [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]];
                    break;
                case 2: // 2 -> R
                    tests = [[0, 0], [1, 0], [2, 0], [1, 2], [-2, -1]];
                    break;
                case 1: // R -> 0
                    tests = [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]];
                    break;
                case 3: // L -> 2
                    tests = [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]];
                    break;
            }

        for (let i = 0; i < tests.length; i++) {
            [x_tran, y_tran] = tests[i];
            if (!this.checkRotateShape_CCW(tetrisBlocks, x_tran, y_tran))
                return [x_tran, y_tran];
        }
        return [null, null];
    }
    checkWallKicks_CW = function () {
        var x_tran, y_tran;
        var tests = [];
        if (this.shape_name != "I")
            switch (this.spawn) {
                case 0: // 0 -> R
                    tests = [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]];
                    break;
                case 2: // 2 -> L
                    tests = [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]];
                    break;
                case 1: // R -> 2
                    tests = [[0, 0], [1, 0], [-1, 1], [0, -2], [1, -2]];
                    break;
                case 3: // L -> 0
                    tests = [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]];
                    break;
            }
        else
            switch (this.spawn) {
                case 0: // 0 -> R
                    tests = [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]];
                    break;
                case 2: // 2 -> L
                    tests = [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]];
                    break;
                case 1: // R -> 2
                    tests = [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]];
                    break;
                case 3: // L -> 0
                    tests = [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]];
                    break;
            }
        for (let i = 0; i < tests.length; i++) {
            [x_tran, y_tran] = tests[i];
            if (!this.checkRotateShape_CW(tetrisBlocks, x_tran, y_tran))
                return [x_tran, y_tran];
        }
        return [null, null];
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
        return false;
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
        for (let height = canvas.height - 2 * brickWidth; height > 0; height -= brickHeight) {

            if (tetrisBlocks[height] != undefined && tetrisBlocks[height + brickHeight] == undefined) {
                tetrisBlocks[height + brickHeight] = tetrisBlocks[height];
                for (var xs in tetrisBlocks[height + brickHeight]) {

                    tetrisBlocks[height + brickHeight][xs].y += brickHeight;
                }
                delete tetrisBlocks[height];
            }
        }
    }
    return tetrisBlocks
}
function scoreClear(clearedLines) {
    switch (clearedLines) {
        case 1:
            score += 100;
            break;
        case 2:
            score += 200;
            break;
        case 3:
            score += 300;
            break;
        case 4:
            score += 500;
            break;
    }
    clearedLines = 0;
    return clearedLines;
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
// Spins from the center of a 3x3 piece - DONE
// Add the long piece - DONE
// The long shape needs to get made and considered in all logic :) - DONE
// Make the spin central to the specific shape - DONE
// Score - DONE
// Differentiate the Blocks colors - DONE
// Show Score - DONE

/* Ongoing / Neverending Improvements */
// Make the keys adequately responsive!!!! - DOING
// Wall kicks - DOING
// Fix weird spins - DOING

// Make score progression natural - From 0-60 once you hit level 1.

/* Logic */
// t spin
// Make it efficient

// Shape randomizer should be distributed probability
// t block in spawn = 0 doesn't wall kick & s block in spawn = 0 or 2 & zin 

/* User Interface */
// Make the cleared blocks blink!
// f5 breaks the music


var shapes = ["t", "s", "z", "L", "reverse-L", "block", "I"];
var tetrisBlocks = {};
var selectedShape = null;
oneTurn = 0; // Timer for how long you can to stay on a block before you stick

function sound(src, loopMe) {
    this.sound = document.createElement("audio");
    this.sound.id = "TetrisAudio";
    this.sound.src = src;
    this.sound.loop = loopMe;
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

var MyMusic = new sound("./resources/Tetris.mp3", true);
var lineClear = new sound("./resources/clear.mp3", false);
var clearFour = new sound("./resources/clear4.mp3", false);

var dropSpeed = 0;
var score = 0;
var level;
function drawGame(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    var clearedLines = 0;
    if (selectedShape == null) // If there is no new shape, create one
    {
        var randShape = shapes[Math.floor(Math.random() * shapes.length)];
        selectedShape = new Shape(randShape);
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

            if (clearedLines > 0 && clearedLines < 4) {
                lineClear.play();
            }
            else if (clearedLines == 4) {
                clearFour.play();
            }


            clearedLines = scoreClear(clearedLines);
            if (selectedShape.checkDead()) {
                alert(`Great Job! You got ${score}`);
                location.reload();
            }

            selectedShape = null; // Reset it
            oneTurn = 0;
        }
        else
            oneTurn += 1;
    }
    else {
        dropSpeed = selectedShape.perTurnMove(dropSpeed); // Drop by a preset amount
        oneTurn = 0;
    }

    xPressed = false;
    cPressed = false;

    var displayScore = document.getElementById("score");
    displayScore.textContent = score;

    setTimeout(function () { window.requestAnimationFrame(drawGame) }, Math.max(0, Math.min(50, 50 + level)));
}

play = () => { MyMusic.play(); window.requestAnimationFrame(drawGame); document.getElementById("start").style.display = "none"; };
