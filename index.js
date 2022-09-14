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
var currCandy
var otherCandy
let blankTexture = PIXI.Texture.from(`./img/blank.png`)

const candyGridGraphic = new PIXI.Graphics()
candyGridGraphic.beginFill(0x8eb8fa)
candyGridGraphic.lineStyle(2, 0x000, 1)
candyGridGraphic.drawRect(0,0,600, 600)
candyGrid.addChild(candyGridGraphic)

const candyGridContent = new PIXI.Container()

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]
}

// console.log(candyGridGraphic.height /9)
// console.log(candyGridGraphic.width /9)
// console.log(randomCandy())

// create contaienr for row and col add sprite to row
for (let r = 0; r < rows; r++) {
    let row = new PIXI.Container()
    for (let c = 0; c < cols; c++) {
        let texture = PIXI.Texture.from(`./img/${randomCandy()}.png`)
        let body = new PIXI.Sprite(texture)
        body.position.x = 5 + (candyGrid.width/9) * c
        body.position.y = 5 + (candyGrid.height/9) * r
        body.interactive = true
        body.accessibleTitle = `${r}-${c}`
        row.addChild(body)

        body.on("pointerdown", dragStart)
        body.on("pointerover", dragOver)
        // this.body.on("pointerupoutside", this.dragEnd.bind(this))
        body.on("pointerup", dragEnd)       
    }
    candyGridContent.addChild(row)
}

function dragStart(e) {
    currCandy = this
    this.alpha = 0.5;
    this.dragging = true;
}
function dragOver(e) {
    if (this.dragging) {
        // this.otherCandy = this
        // console.log(this.getPos(this))
    }
}
function dragEnd(e) {

    otherCandy = this
    if (otherCandy.texure === blankTexture || currCandy.texure === blankTexture) {
        console.log("fas")
        return
    }
    let currCandyRowCol = currCandy.accessibleTitle.split('-')
    let otherCandyRowCol = otherCandy.accessibleTitle.split('-')
    let r1 = parseInt(currCandyRowCol[0])
    let c1 = parseInt(currCandyRowCol[1])
    let r2 = parseInt(otherCandyRowCol[0])
    let c2 = parseInt(otherCandyRowCol[1])

    // only move by one adjacent
    let moveLeft = c2 === c1 - 1 && r2 === r1
    let moveRight = c2 === c1 + 1 && r2 === r1
    let moveUp = c2 === c1 && r2 === r1 - 1
    let moveDown = c2 === c1 && r2 === r1 + 1

    let nextTo = moveLeft || moveRight || moveUp || moveDown

    if(nextTo) {
        swap(otherCandy, "texture", currCandy, "texture")

        let check = isValid(r1, c1)
        if (!check) {
            console.log("swap back")
            swap(otherCandy, "texture", currCandy, "texture")
        }
    }

    console.log(otherCandy)
    // console.log(currCandy)
    // console.log(candyGrid)
    this.alpha = 1;
    currCandy.alpha = 1;
    this.dragging = false;
}

function swap(obj1, key1, obj2, key2) {
    [obj1[key1], obj2[key2]] = [obj2[key2], obj1[key1]];
 }

 function checkThreeOrMore () {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < cols - 2; c++) {
            let candy1 = candyGridContent.children[r].children[c]
            let candy2 = candyGridContent.children[r].children[c+1]
            let candy3 = candyGridContent.children[r].children[c+2]
            if (candy1.texture === candy2.texture && candy2.texture === candy3.texture && candy1.texture !== blankTexture) {
                candy1.texture = blankTexture
                candy2.texture = blankTexture
                candy3.texture = blankTexture
            }
        }
    }
    for(let c = 0; c < cols; c++) {
        for(let r = 0; r < rows - 2; r++) {
            let candy1 = candyGridContent.children[r].children[c]
            let candy2 = candyGridContent.children[r+1].children[c]
            let candy3 = candyGridContent.children[r+2].children[c]
            if (candy1.texture === candy2.texture && candy2.texture === candy3.texture && candy1.texture !== blankTexture) {
                candy1.texture = blankTexture
                candy2.texture = blankTexture
                candy3.texture = blankTexture

            }
        }
    }
}

function isValid (r1, c1) {
    console.log(candyGridContent)
    // console.log(candyGrid.children[r1].children[c1].texture.textureCacheIds)
    // console.log(candyGrid.children[r1].children[c1].texture.textureCacheIds)
    for(let r = 1; r < rows; r++) {
        for(let c = 0; c < cols - 2; c++) {
            let candy1 = candyGrid.children[r].children[c]
            let candy2 = candyGridContent.children[r].children[c+1]
            let candy3 = candyGridContent.children[r].children[c+2]
            if (candy1.texture === candy2.texture && candy2.texture === candy3.texture && candy1.texture !== blankTexture) {
                console.log("true")
                console.log(candy1.texture)
                console.log(candy2.texture)
                console.log(candy3.texture)
                return true
            }
        }
    }
    for(let c = 0; c < cols; c++) {
        for(let r = 0; r < rows - 2; r++) {
            let candy1 = candyGridContent.children[r].children[c]
            let candy2 = candyGridContent.children[r+1].children[c]
            let candy3 = candyGridContent.children[r+2].children[c]
            if (candy1.texture === candy2.texture && candy2.texture === candy3.texture && candy1.texture !== blankTexture) {
                console.log("true")
                console.log(candy1.texture)
                console.log(candy2.texture)
                console.log(candy3.texture)
                return true
            }
        }
    }
    // will make candy swap back
    return false
}

// console.log(candyGridArray)
candyGrid.addChild(candyGridContent)
app.stage.addChild(candyGrid)

function gameLoop() {
    checkThreeOrMore()
    requestAnimationFrame(gameLoop);
}

gameLoop()