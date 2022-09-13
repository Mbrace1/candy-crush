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
let candyGridArray = []
const candyGrid = new PIXI.Container()
candyGrid.x = 50
candyGrid.y = 50
let currCandy
let otherCandy
let currCandyGridPos
let otherCandyGridPos

const candyGridGraphic = new PIXI.Graphics()
candyGridGraphic.beginFill(0x8eb8fa)
candyGridGraphic.lineStyle(2, 0x000, 1)
candyGridGraphic.drawRect(0,0,600, 600)
candyGrid.addChild(candyGridGraphic)

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]
}

// console.log(candyGridGraphic.height /9)
// console.log(candyGridGraphic.width /9)
// console.log(randomCandy())
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        let candySprite = new Candy(r, c, randomCandy(), candyGrid)
        candyGridArray.push(candySprite)
    }
}


console.log(candyGridArray)
app.stage.addChild(candyGrid)

function gameLoop() {
    requestAnimationFrame(gameLoop);
}

gameLoop()