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
let cellWidth = 60
let cellHeight = 60
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]
}

// const candyGridGraphic = new PIXI.Graphics()
// candyGridGraphic.beginFill(0x8eb8fa)
// candyGridGraphic.lineStyle(2, 0x000, 1)
// candyGridGraphic.drawRect(0,0,600, 600)
// candyGrid.addChild(candyGridGraphic)
let candyGrid = new PIXI.Container()
candyGrid.on("mousedown", onMouseDown);

let array = []
class Cell {
    constructor(x, y, type, candyGrid) {
        this.candyGrid = candyGrid
        this.type = type
        this.texture = PIXI.Texture.from(`./img/${type}.png`)
        this.body = new PIXI.Sprite(this.texture)
        this.body.position.x = x
        this.body.position.y = y

    }

    update(newX, newY) {
        this.body.position.x = this.body.position.x + newX
        this.body.position.y = this.body.position.y + newY
    }

    render() {
        this.candyGrid.addChild(this.body)
    }
}

function createBoard() {
    candyGrid.interactive = true
    app.stage.addChild(candyGrid)

    for (let r = 0; r < rows; r++) {
        let row = []
        for (let c = 0; c < cols; c++) {
            let cell = new Cell(r*cellWidth + 50, c*cellHeight + 50, randomCandy(), candyGrid)
            // row.addChild(cell.body)
            row.push(cell)
        }
        array.push(row)
    }
}

createBoard()


function gameLoop() {
    candyGrid.removeChildren()
    // update()
    render()
    requestAnimationFrame(gameLoop);
    // console.log("hi")
    
}

gameLoop()

function render() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            array[r][c].render()
        }
    }
}
function update() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            console.log(array[r][c].update(5, 5))
        }
    }
}

function swap() {
    console.log(array[0][0].body.position.y)
    console.log(array[0][1].body.position.y)
    let pos1= array[0][0].body.position.y
    let pos2= array[0][1].body.position.y
    
    array[0][0].update(0, cellHeight)
    array[0][1].update(0, -cellHeight)
}


function onMouseDown(e) {
    console.log("swap")
    swap()
}