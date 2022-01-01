const TOTAL_ROWS = 20;
const TOTAL_COLS = 10;
const CANVAS_WIDTH_SIZE = 400;
const CANVAS_HEIGHT_SIZE = 800;
const BOX_HEIGHT = 40;
const BOX_WIDTH = 40;

const pieceZ = [
    [[1, 1, 0],
    [0, 1, 1]], 
    
    [[0, 1],
    [1, 1],
    [1, 0]],
    
];

const pieceT = [
    [[1, 1, 1],
    [0, 1, 0]], 
    
    [[1, 0],
    [1, 1],
    [1, 0]],
    
    [[0, 1, 0],
    [1, 1, 1]],
    
    [[0, 1],
    [1, 1],
    [0, 1]]
];

const pieceS = [
    [[0, 1, 1],
    [1, 1, 0]], 
    
    [[1, 0],
    [1, 1],
    [0, 1]],
    
];

const pieceO = [
    [[1, 1],
    [1, 1]]
];

const pieceJ = [
    [[0, 1],
    [0, 1],
    [1, 1]], 
    
    [[1, 1, 1],
    [0, 0, 1]],
    
    [[1, 1],
    [1, 0],
    [1, 0]],
    
    [[1, 0, 0],
    [1, 1, 1]]
];

const pieceL = [
    [[1, 0],
    [1, 0],
    [1, 1]], 
    
    [[0, 0, 1],
    [1, 1, 1]],
    
    [[1, 1],
    [0, 1],
    [0, 1]],
    
    [[1, 1, 1],
    [1, 0, 0]]
];

const pieceI = [
    [[1],
    [1],
    [1],
    [1]],
    
    [[1, 1, 1, 1]]
];

const pieceStair = [
    [[1, 0, 0],
    [1, 1, 0],
    [1, 1, 1]],
    
    [[0, 0, 1],
    [0, 1, 1],
    [1, 1, 1]],
    
    [[1, 1, 1],
    [0, 1, 1],
    [0, 0, 1]],
    
    [[1, 1, 1],
    [1, 1, 0],
    [1, 0, 0]],
];

let lockedPieces = [];
let board = [];
createBoard();

let piecePosX = 120;
let piecePosY= 0;
let score = 0;
let lines = 0;
let timesRotate = 0;

const tetroList = [pieceO, pieceI, pieceJ, pieceL, pieceS, pieceT, pieceZ, pieceStair];
const colorList = ["chartreuse", "blue", "cyan", "red", "yellow", "orange", "darkviolet"];

let pieceType = tetroList[Math.floor(Math.random() * tetroList.length)];
let currPiece = pieceType[0];
let currColor = colorList[Math.floor(Math.random() * colorList.length)];

let nextPieceType = tetroList[Math.floor(Math.random() * tetroList.length)];
let nextPiece = nextPieceType[0];
let nextColor = colorList[Math.floor(Math.random() * colorList.length)];

// Initial position of the upmost left piece
let pieceTopLeft = {
    row: 0,
    col: 3
};

// Creates a 20 x 10 array filled with 0's to start.
function createBoard()
{
    for(let currRow = 0; currRow < TOTAL_ROWS; currRow++)
    {
        board[currRow] = [];
        for(let currCol = 0; currCol < TOTAL_COLS; currCol++)
        {
            board[currRow][currCol] = 0;
        }
    }
}

// Return false if the wanted location is outside the boundaries,
// or the location is already occupied. Otherwise, return true.
function canMove(desiredTopLeftRow, desiredTopLeftCol)
{
    for(let row = 0; row < currPiece.length; row++)
    {
        for(let col = 0; col < currPiece[row].length; col++)
        {
            if(currPiece[row][col] == 1)
            {
                if((row + desiredTopLeftRow) > (TOTAL_ROWS-1) || (col + desiredTopLeftCol) < (TOTAL_COLS-TOTAL_COLS) || 
                        (col + desiredTopLeftCol) > (TOTAL_COLS-1) || 
                        board[row + desiredTopLeftRow][col + desiredTopLeftCol] == 1)
                {
                    return false;
                }
            }
        }
    }
    return true;
}

// Creates automatic falling for the current piece,
// updates game menu, clears filled rows, determines pieces saved, 
// and changes the status of the game.
function update()
{
    if(canMove((pieceTopLeft.row+1), pieceTopLeft.col))
    {
        piecePosY+=40;
        pieceTopLeft.row++;
    }
    else
    {
        // Stores the pieces in order to redraw them later
        // Every single square is saved
        for(let row = 0; row < currPiece.length; row++)
        {
            for(let col = 0; col < currPiece[row].length; col++)
            {
                if(currPiece[row][col] != 0)
                {
                    let newX = piecePosX + (col * BOX_WIDTH);
                    let newY = piecePosY + (row * BOX_HEIGHT);
                    lockedPieces.push([newX, newY, currColor]);
                    board[newY/BOX_HEIGHT][newX/BOX_WIDTH] = 1;
                }
            }
        }

        for(let row = TOTAL_ROWS-1; row > 0; row--)
        {
            let count = 0;
            for(let col = 0; col < TOTAL_COLS; col++)
            {
                if(board[row][col] == 1)
                {
                    count++;
                }
            }
            if(count == TOTAL_COLS)
            {
                for(let updateRow = row; updateRow > 0; updateRow--)
                {
                    for(let theCol = 0; theCol < TOTAL_COLS; theCol++)
                    {
                        board[updateRow][theCol] = board[updateRow-1][theCol];
                    }
                }
                for(let index = 0; index < lockedPieces.length; index++)
                {
                    if((lockedPieces[index][1] / 40) == row)
                    {
                        lockedPieces.splice(index, 1);
                        index--;
                    }
                    else if((lockedPieces[index][1] / 40) < row)
                    {
                        lockedPieces[index][1]+=40;
                    }
                }
                document.getElementById("score").textContent = ("Score: " + (score+=100));
                document.getElementById("lines").textContent = ("Lines: " + (lines+=1));
                row++;
            }
        }
        // Change pieces and starts at the top again
        if(piecePosY > 0)
        {
            piecePosX = 120;
            piecePosY = 0;
            pieceTopLeft.row = 0;
            pieceTopLeft.col = 3;

            currPiece = nextPiece;
            pieceType = nextPieceType;
            currColor = nextColor;
            
            nextPieceType = tetroList[Math.floor(Math.random() * tetroList.length)];
            nextPiece = nextPieceType[0];
            nextColor = colorList[Math.floor(Math.random() * colorList.length)];
            timesRotate = 0;
        }
        else
        {
            gameOver = true;
            Swal.fire(
                'Game Over',
            )
            currPiece = null;
        }
    }
}

const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");
const nextPieceCanvas = document.getElementById("piece");
const nextPieceCtx = nextPieceCanvas.getContext("2d");

ctx.shadowColor = 'black';
ctx.shadowBlur = 10;
nextPieceCtx.shadowColor = 'black';
nextPieceCtx.shadowBlur = 10;

// Draws the existing pieces in the game
function draw()
{
    // Prevents the current piece from trailing
    ctx.clearRect(0, 0, CANVAS_WIDTH_SIZE, CANVAS_HEIGHT_SIZE);
    nextPieceCtx.clearRect(0, 0, CANVAS_WIDTH_SIZE, CANVAS_HEIGHT_SIZE);
    
    // // Redraws landed pieces on the board
    for(let index = 0; index < lockedPieces.length; index++)
    {
        ctx.fillStyle = lockedPieces[index][2];
        ctx.fillRect(lockedPieces[index][0], lockedPieces[index][1], 40, 40);
    }
    
    drawPiece(ctx, piecePosX, piecePosY, currPiece, currColor);
    drawPiece(nextPieceCtx, 40, 30, nextPiece, nextColor);
}

// Draws a piece on its given canvas 
function drawPiece(ctx, xPlace, yPlace, piece, pieceColor)
{
    for(let row = 0; row < piece.length; row++)
    {
        for(let col = 0; col < piece[row].length; col++)
        {
            if(piece[row][col] != 0)
            {
                ctx.fillStyle = pieceColor;
                let newX = xPlace + (col * BOX_WIDTH);
                let newY = yPlace + (row * BOX_HEIGHT);
                ctx.fillRect(newX, newY, BOX_WIDTH, BOX_HEIGHT);
            }
        }
    }
}

// Looks for keyboard input (only W, A, S, & D and all arrow keys work).
function keyDownHandler(event)
{
    // When the A or Left Arrow key is pressed, 
    // move the piece to the left only if it is safe.
    if((event.keyCode == 65 || event.keyCode == 37) && canMove(pieceTopLeft.row, (pieceTopLeft.col-1)))
    {
        piecePosX-=BOX_WIDTH;
        pieceTopLeft.col--;
    }

    // When the D or Right Arrow key is pressed, 
    // move the piece to the right only if it is safe.
    else if((event.keyCode == 68 || event.keyCode == 39) && canMove(pieceTopLeft.row, (pieceTopLeft.col+1)))
    {
        piecePosX+=BOX_WIDTH;
        pieceTopLeft.col++;
    }
    // When the S or Down Arrow key is pressed, 
    // move the piece to the down only if it is safe.
    if((event.keyCode == 83 || event.keyCode == 40) && canMove((pieceTopLeft.row+1), pieceTopLeft.col))
    {
        piecePosY+=BOX_HEIGHT;
        pieceTopLeft.row++;
    }
    
    // When the W or Up Arrow key is pressed,
    // rotate the piece clockwise only if it is safe.
    else if(event.keyCode == 87 || event.keyCode == 38)
    {
        let temp = currPiece;
        if(timesRotate < pieceType.length-1)
        {
            currPiece = pieceType[timesRotate+1];
            if(canMove((piecePosY/40), (piecePosX / 40)))
            {
                timesRotate++;
            }
            else
            {
                currPiece = temp;
            }
        }
        else
        {
            currPiece = pieceType[0];
            if(canMove((piecePosY/40), (piecePosX / 40)))
            {
                timesRotate = 0;
            }
            else
            {
                currPiece = temp;
            }
        }
    }
}

let startTime = 0;
let stepMS = 300;
let request;
let gameOver = false;

// Runs the game as long as the game isn't over.
function loop(timestamp)
{
    if(!gameOver)
    {
        let progress = timestamp - startTime;
        if(progress > stepMS)
        {
            startTime = timestamp;
            update();
            draw();
        }

        request = window.requestAnimationFrame(loop);
    }
}

document.getElementById('start').addEventListener("click", startGame);
document.getElementById('pause').addEventListener("click", pauseGame);
document.getElementById('restart').addEventListener("click", restartGame);

// Starts or continues movement in the game.
function startGame()
{
    request = window.requestAnimationFrame(loop);
    document.addEventListener('keydown', keyDownHandler, false);
}

// Clears everything in the game and starts it over.
function restartGame()
{
    window.location.reload();
}

// Freezes movement in the game.
function pauseGame()
{
    window.cancelAnimationFrame(request);
    document.removeEventListener('keydown', keyDownHandler, false);
}