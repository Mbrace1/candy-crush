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
        let texture = PIXI.Texture.from(`./img/${randomCandy()}.png`)
        let body = new PIXI.Sprite(texture)
        body.position.x = 5 + (candyGrid.width/9) * c
        body.position.y = 5 + ((candyGrid.height/9) * r)
        body.interactive = true
        candyGrid.addChild(body)

        body.on("pointerdown", dragStart)
        body.on("pointerover", dragOver)
        // this.body.on("pointerupoutside", this.dragEnd.bind(this))
        body.on("pointerup", dragEnd)       
        candyGridArray.push(body)
    }
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
    console.log(otherCandy.texture)
    console.log(currCandy)
    swap(otherCandy, "texture", currCandy, "texture")
    // const otherCandyPos = otherCandy.position
    // const currCandyPos = currCandy.position
    
    // otherCandy.position = currCandyPos
    // currCandy.position = otherCandyPos

    // console.log(otherCandy.body.position)
    // console.log(currCandy.body.position)
    this.alpha = 1;
    currCandy.alpha = 1;
    this.dragging = false;
}

function swap(obj1, key1, obj2, key2) {
    [obj1[key1], obj2[key2]] = [obj2[key2], obj1[key1]];
 }

console.log(candyGridArray)
app.stage.addChild(candyGrid)

function gameLoop() {
    requestAnimationFrame(gameLoop);
}

gameLoop()