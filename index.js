const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerheight,
    resizeTo: window,
    transparent: true,
});

document.body.appendChild(app.view);

let candies = ["Red", "Blue", "Green", "Orange", "Yellow", "Purple"]
let cols = 9
let rows = 9
let candyGrid = new PIXI.Container()
let candyGridArray = []
let lastTime = 0;
let animationtimetotal = 1;
let selectedCandy = {col: 0, row: 0, selected: false}
let drag = false;

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]
}


candyGrid.on("mousemove", onMouseMove);
candyGrid.on("mousedown", onMouseDown);
candyGrid.on("mouseup", onMouseUp);
candyGrid.on("mouseout", onMouseOut);

// initial game
newGame()

function newGame() {
    //  create grid
    candyGrid.x = 50
    candyGrid.y = 50
    candyGrid.interactive = true
    const candyGridGraphic = new PIXI.Graphics()
    candyGridGraphic.x = 50
    candyGridGraphic.y = 50
    candyGridGraphic.beginFill(0x8eb8fa)
    candyGridGraphic.lineStyle(2, 0x000, 1)
    candyGridGraphic.drawRect(0,0,600, 600)
    app.stage.addChild(candyGridGraphic)
    app.stage.addChild(candyGrid)

    for (let c = 0; c < cols; c++) {
        candyGridArray[c] = [];
        for (let r = 0; r < rows; r++) {
            let texture = PIXI.Texture.from(`./img/${randomCandy()}.png`)
            let candy = new PIXI.Sprite(texture)
            candy.anchor.set(0.5);
            candy.interactive = true
            candyGridArray[c][r] = { sprite: candy, shift:0 }
        }
    }

    gameLoop(lastTime)
}

// event listeners

function gameLoop(lastTime) {
    updateGrid(lastTime)
    drawCandy()
    requestAnimationFrame(gameLoop);
}

function updateGrid() {
    // move and animate candy
}

function drawCandy() {
    candyGrid.removeChildren()
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            let shift = candyGridArray[c][r].shift;
            let candy = candyGridArray[c][r].sprite
            if (candy) {
                candy.x = 50 + (r + shift * lastTime/animationtimetotal) * 60
                candy.y = 50 + c * 60
                candyGrid.addChild(candy)
            }
            
        }
    }
}

function onMouseDown(e) {
    let pos = app.renderer.plugins.interaction.mouse.global
    console.log(candyGridArray)
    if (!drag) {
        let click = getMouseTile(pos)
        var swapped = false;
        if (click.valid){
            if (selectedCandy.selected) {
                if (click.x == selectedCandy.col && click.y == selectedCandy.row) {
                    selectedCandy.selected = false;
                    drag = true;
                    return;
                } else if (canSwap(click.x, click.y, selectedCandy.col, selectedCandy.row)){
                    mouseSwap(click.x, click.y, selectedCandy.col, selectedCandy.row);
                    swapped = true;
                }
            }
            if (!swapped) {
                selectedCandy.col = click.x;
                selectedCandy.row = click.y;
                selectedCandy.selected = true;
            }
        } else {
            selectedCandy.selected = false;
        }
    }
    drag = true;
    console.log(selectedCandy)
}

function onMouseUp(e) {
    drag = false;
}

function onMouseOut(e) {
    drag = false;
}

function onMouseMove(e) {
    let pos = app.renderer.plugins.interaction.mouse.global
    if (drag && selectedCandy.selected) {
        let click = getMouseTile(pos);
        if (click.valid) {
            
            if (canSwap(click.x, click.y, selectedCandy.col, selectedCandy.row)){
                mouseSwap(click.x, click.y, selectedCandy.col, selectedCandy.row);
            }
        }
    }
}


function getMouseTile(pos) {
    var tx = Math.floor((pos.x -candyGrid.x) / 60);
    var ty = Math.floor((pos.y -candyGrid.y) / 60);
    
    if (tx >= 0 && tx < cols && ty >= 0 && ty < rows) {
        return {
            valid: true,
            x: tx,
            y: ty
        };
    }
    
    return {
        valid: false,
        x: 0,
        y: 0
    };
}


function canSwap(x1, y1, x2, y2) {
    if ((Math.abs(x1 - x2) == 1 && y1 == y2) ||
        (Math.abs(y1 - y2) == 1 && x1 == x2)) {
        return true;
    }
    return false;
}

function mouseSwap(x1, y1, x2, y2) {
    console.log("swap")
    var spriteswap = candyGridArray[y1][x1].sprite;
    candyGridArray[y1][x1].sprite = candyGridArray[y2][x2].sprite;
    candyGridArray[y2][x2].sprite = spriteswap;
    selectedCandy.selected = false;
}
