class Candy {
    constructor(row, col, img, grid) {
        this.row = row
        this.col = col
        // this.candyGridArray = candyGridArray
        this.texture = PIXI.Texture.from(`./img/${img}.png`)
        this.body = new PIXI.Sprite(this.texture)
        this.body.position.x = 5 + (grid.width/9) * this.col 
        this.body.position.y = 5 + ((grid.height/9) * this.row)
        this.body.interactive = true
        grid.addChild(this.body)

        this.body.on("pointerdown", this.dragStart.bind(this))
        this.body.on("pointerover", this.dragOver)
        // this.body.on("pointerupoutside", this.dragEnd.bind(this))
        this.body.on("pointerup", this.dragEnd.bind(this))

    }

    dragStart(e) {
        currCandy = this
        this.alpha = 0.5;
        this.dragging = true;
    }
    dragOver(e) {
        if (this.dragging) {
            // this.otherCandy = this
            // console.log(this.getPos(this))
        }
    }
    dragEnd(e) {

        otherCandy = this
        console.log(otherCandy.body.position)
        console.log(currCandy.body.position)

        const otherCandyPos = otherCandy.body.position
        const currCandyPos = currCandy.body.position
        
        otherCandy.body.position = currCandyPos
        currCandy.body.position = otherCandyPos

        // console.log(otherCandy.body.position)
        // console.log(currCandy.body.position)
        this.alpha = 1;
        currCandy.alpha = 1;
        this.dragging = false;
    }

    getPos() {
        return this.body.position
    }
}