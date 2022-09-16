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
let gamestate = true
let blankTexture = PIXI.Texture.from(`./img/blank.png`)
// let clusters = []

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
    // if gamestate is false update with animations
    updateGrid(lastTime)
    drawCandy()
    requestAnimationFrame(gameLoop);
}

function updateGrid() {
    // move and animate candy
    // remove three in line
    // update score
    // generate new candy

    findThreeOrMore()
    // removeThreeOrMore()
}

function findThreeOrMore() {
    let clusters = []
    // cols check
    for (var j=0; j<rows; j++) {
        var matchlength = 1;
        for (var i=0; i<cols; i++) {
            var checkcluster = false;
            if (i == cols-1) {
                checkcluster = true;
            } else {
                if (candyGridArray[i][j].sprite.texture == candyGridArray[i+1][j].sprite.texture &&
                    candyGridArray[i][j].sprite.texture != blankTexture) {
                    matchlength++;
                } else {
                    checkcluster = true
                }
            }

            if (checkcluster) {
                console.log(matchlength)
                if (matchlength >= 3) {
                    clusters.push({row: i+1-matchlength,col: j, length: matchlength, horizontal: false})
                }
                matchlength = 1
            }
        }
    }
    // row check
    for (var i=0; i<cols; i++) {
        var matchlength = 1;
        for (var j=0; j<rows; j++) {
            var checkcluster = false;
            
            if (j == rows-1) {
                checkcluster = true;
            } else {
                if (candyGridArray[i][j].sprite.texture == candyGridArray[i][j+1].sprite.texture &&
                    candyGridArray[i][j].sprite.texture != blankTexture) {
                    matchlength++;
                } else {
                    checkcluster = true;
                }
            }
            
            if (checkcluster) {
                if (matchlength >= 3) {
                    clusters.push({ column: i, row:j+1-matchlength,
                                    length: matchlength, horizontal: true });
                }
                
                matchlength = 1;
            }
        }
    }
    console.log(clusters)
    // console.log(matchlength)
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
                candy.alpha = 1
                candyGrid.addChild(candy)
            }
        }
    }
    if (selectedCandy.selected) {
        candyGridArray[selectedCandy.row][selectedCandy.col].sprite.alpha = 0.5
    }
}

function onMouseDown(e) {
    let pos = app.renderer.plugins.interaction.mouse.global
    // console.log(candyGridArray)
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
    // console.log(selectedCandy)
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
    // console.log("swap")
    var spriteswap = candyGridArray[y1][x1].sprite;
    candyGridArray[y1][x1].sprite = candyGridArray[y2][x2].sprite;
    candyGridArray[y2][x2].sprite = spriteswap;
    selectedCandy.selected = false;

    // Start animation
    animationstate = 2;
    animationtime = 0;
    gamestate = false;
}
