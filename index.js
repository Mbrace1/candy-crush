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
let candyGridArray = new PIXI.Container()
candyGrid.x = 50
candyGrid.y = 50
candyGrid.width = 600
candyGrid.height = 600
let currCandy
let otherCandy
let currCandyGridPos
let otherCandyGridPos

const candyGridGraphic = new PIXI.Graphics()
candyGridGraphic.beginFill(0x8eb8fa)
candyGridGraphic.lineStyle(2, 0x000, 1)
candyGridGraphic.drawRect(0,0,600, 600)
candyGrid.addChild(candyGridGraphic)
candyGrid.addChild(candyGridArray)

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]
}

for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        let texture = PIXI.Texture.from(`./img/${randomCandy()}.png`)
        let body = new PIXI.Sprite(texture)
        // body.position.x = (candyGrid.width/cols) * c 
        // body.position.y = (candyGrid.height/rows) * r
        body.interactive = true

        //  event listeners
        body.on("pointerdown", dragStart)
        // body.on("pointerover", dragOver)
        // body.on("pointerup", dragEnd)

        candyGridArray.addChild(body)
    }
}

let pos1 = candyGridArray
let pos2 = candyGridArray

app.stage.addChild(candyGrid)

function gameLoop() {
    render()
    requestAnimationFrame(gameLoop);
}

gameLoop()

function render() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            candyGridArray.children[r].position.x = (candyGrid.width/cols) * c 
            candyGridArray.children[r].position.y = (candyGrid.height/rows) * r
        }
    }
}

function dragStart(e) {
    let newPos = pos1
    pos1 = pos2
    pos2 = newPos
    console.log(pos1)
    console.log(pos2)
    // re render
}