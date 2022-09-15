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

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]
}

// initial game
newGame()

function newGame() {
    //  create grid
    candyGrid.x = 50
    candyGrid.y = 50
    const candyGridGraphic = new PIXI.Graphics()
    candyGridGraphic.beginFill(0x8eb8fa)
    candyGridGraphic.lineStyle(2, 0x000, 1)
    candyGridGraphic.drawRect(0,0,600, 600)
    candyGrid.addChild(candyGridGraphic)

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
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            // Get the shift of the tile for animation
            let shift = candyGridArray[c][r].shift;
            // console.log(shift)
            let candy = candyGridArray[c][r].sprite
            if (candy) {
                // Get the color of the tile
                candy.x = 50 + (r + shift * lastTime/animationtimetotal) * 60
                candy.y = 50 + c * 60
                candyGrid.addChild(candy)
            }
            
        }
    }
}

// function spriteCood(column, row, columnoffset, rowoffset) {
//     let tilex =(column + columnoffset) * level.tilewidth;
//     let tiley =(row + rowoffset) * level.tileheight;
//     return { tilex: tilex, tiley: tiley};
// }