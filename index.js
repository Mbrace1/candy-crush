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
let currentmove = {column1: 0, row1: 0, column2: 0, row2: 0};
let selectedCandy = {col: 0, row: 0, selected: false}
let drag = false;

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
candyGrid.on("mousemove", onMouseMove);
candyGrid.on("mouseup", onMouseUp);
candyGrid.on("mouseout", onMouseOut);

let array = []
class Cell {
    constructor(x, y, type, candyGrid) {
        this.candyGrid = candyGrid
        this.type = type
        this.texture = PIXI.Texture.from(`./img/${type}.png`)
        this.body = new PIXI.Sprite(this.texture)
        this.body.position.x = x
        this.body.position.y = y
        this.body.anchor.x = 0.5
        this.body.anchor.y = 0.5

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

function swap(r1, c1, r2, c2) {
    let candy1 = array[r1-1][c1-1].body.texture
    array[r1-1][c1-1].body.texture = array[r2-1][c2-1].body.texture
    array[r2-1][c2-1].body.texture = candy1
    // let candy1Col = candy1.body.position.x
    // let candy1Row = candy1.body.position.y

    // let candy2Col = candy2.body.position.x
    // let candy2Row = candy2.body.position.y

    // // change x or col values
    // if (candy1Col < candy2Col) {
    //     // candy1 is less so move right
    //     // candy2 is more so move left
    //     candy1.update(cellHeight, 0)
    //     candy2.update(- cellHeight, 0)
    // } else if (candy1Col > candy2Col) {
    //     candy1.update(- cellHeight, 0)
    //     candy2.update(cellHeight, 0)
    // }

    // // change y or row values
    // if (candy1Row < candy2Row) {
    //     // candy1 is less so move up
    //     // candy2 is more so move up
    //     candy1.update(0, cellWidth)
    //     candy2.update(0, - cellWidth)
    // } else if (candy1Row > candy2Row) {
    //     // candy1 is more so move down
    //     candy1.update(0, - cellWidth)
    //     candy2.update(0, cellWidth)
    // }

}


function onMouseDown(e) {
    console.log(array[0][0].body.position.x)
    let pos = app.renderer.plugins.interaction.mouse.global
    // console.log(candyGridArray)
    if (!drag) {
        let click = getMouseCell(pos)
        console.log(click)
        var swapped = false;
        if (click.valid){
            if (selectedCandy.selected) {
                if (click.x == selectedCandy.col && click.y == selectedCandy.row) {
                    selectedCandy.selected = false;
                    drag = true;
                    return;
                } else if (canSwap(click.y, click.x, selectedCandy.row, selectedCandy.col)){
                    mouseSwap(click.y, click.x, selectedCandy.row, selectedCandy.col);
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
        let click = getMouseCell(pos);
        if (click.valid) {
            
            if (canSwap(click.y, click.x, selectedCandy.row, selectedCandy.col)){
                mouseSwap(click.y, click.x, selectedCandy.row, selectedCandy.col);
            }
        }
    }
}


function getMouseCell(pos) {
    var trow = Math.floor((pos.x -candyGrid.x) / 60);
    var tcol = Math.floor((pos.y -candyGrid.y) / 60);
    
    if (tcol >= 0 && tcol < cols && trow >= 0 && trow < rows) {
        return {
            valid: true,
            x: tcol,
            y: trow
        };
    }
    
    return {
        valid: false,
        x: 0,
        y: 0
    };
}

function canSwap(r1, c1, r2, c2) {
    if ((Math.abs(r1 - r2) == 1 && c1 == c2) ||
        (Math.abs(c1 - c2) == 1 && r1 == r2)) {
        return true;
    }
    return false;
}

function mouseSwap(r1, c1, r2, c2) {
    // console.log("swap")
    currentmove = {column1: c1, row1: r1, column2: c2, row2: r2};
    selectedCandy.selected = false;
    swap(r1, c1, r2, c2)

    // // Start animation
    // animationstate = 2;
    // animationtime = 0;
    // gamestate = false;
}
