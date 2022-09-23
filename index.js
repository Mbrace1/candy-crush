const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerheight,
    resizeTo: window,
    transparent: true,
});

document.body.appendChild(app.view);

// variable will be using throughout
let candies = ["Red", "Blue", "Green", "Orange", "Yellow", "Purple"]
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]
}

let cols = 9
let rows = 9
let candyGrid = new PIXI.Container()
let candyGridArray = []
let lastTime = 0;
let animationtime = 0;
let animationtimetotal = .8;
let selectedCandy = {col: 0, row: 0, selected: false}
let drag = false;
let gamestate = true
let blankTexture = PIXI.Texture.from(`./img/blank.png`)
let clusters = []
let currentmove = {column1: 0, row1: 0, column2: 0, row2: 0};
let particleNum = 200

// score
let scoreStyle = {
    fontFamily: 'Arial',
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#FFC0CB'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
}
let score = 0
let scoreContainer = new PIXI.Container()
scoreContainer.x = 700;
scoreContainer.y = 100;
let scoreText1 = new PIXI.Text('Score: ');
scoreText1.x = 0
scoreText1.anchor.y = 0.5
let scoreText2 = new PIXI.Text(score);
scoreText2.anchor.y = 0.5
scoreText2.x = 20 + scoreText1.width
scoreText1.style = new PIXI.TextStyle(scoreStyle)
scoreText2.style = new PIXI.TextStyle(scoreStyle)

// game board
candyGrid.x = 50
candyGrid.y = 50
candyGrid.interactive = true
let candyGridGraphic = new PIXI.Graphics()
candyGridGraphic.x = 50
candyGridGraphic.y = 50
candyGridGraphic.alpha = .7
candyGridGraphic.beginFill(0x8eb8fa) //0x8eb8fa
candyGridGraphic.lineStyle(2, 0x0, 1)
candyGridGraphic.drawRoundedRect(0,0,600, 600 , 14)

// fireworks at corners of game board
const fireworkTextures = []
for(let i = 1; i < 26 ;i++) {
    const fireTexture = PIXI.Texture.from(`./img/explosion/Firework${i}.png`)
    fireworkTextures.push(fireTexture)
}

let fireworks1 = new PIXI.AnimatedSprite(fireworkTextures)
let fireworks2 = new PIXI.AnimatedSprite(fireworkTextures)
let fireworks3 = new PIXI.AnimatedSprite(fireworkTextures)
let fireworks4 = new PIXI.AnimatedSprite(fireworkTextures)

setSame(fireworks1)
setSame(fireworks2)
setSame(fireworks3)
setSame(fireworks4)
function setSame(fireworks) {
    fireworks.animationSpeed = 0.5
    fireworks.anchor.x = 0.5
    fireworks.anchor.y = 0.5
}

let fireworkContainer1 = new PIXI.Container()
fireworkContainer1.x = 50
fireworkContainer1.y = 90
fireworkContainer1.addChild(fireworks1)

let fireworkContainer2 = new PIXI.Container()
fireworkContainer2.x = 650
fireworkContainer2.y = 90
fireworkContainer2.addChild(fireworks2)

let fireworkContainer3 = new PIXI.Container()
fireworkContainer3.x = 650
fireworkContainer3.y = 670
fireworkContainer3.addChild(fireworks3)

let fireworkContainer4 = new PIXI.Container()
fireworkContainer4.x = 50
fireworkContainer4.y = 670
fireworkContainer4.addChild(fireworks4)

// event listeners see bottom of file
candyGrid.on("mousemove", onMouseMove);
candyGrid.on("mousedown", onMouseDown);
candyGrid.on("mouseup", onMouseUp);
candyGrid.on("mouseout", onMouseOut);


// bg moving candies
let particleContainer = {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
}

const candyRed = new PIXI.ParticleContainer(particleNum, particleContainer);
const candyBlue = new PIXI.ParticleContainer(particleNum, particleContainer);
const candyGreen = new PIXI.ParticleContainer(particleNum, particleContainer);
const candyOrange = new PIXI.ParticleContainer(particleNum, particleContainer);
const candyYellow = new PIXI.ParticleContainer(particleNum, particleContainer);
const candyPurple = new PIXI.ParticleContainer(particleNum, particleContainer);
app.stage.addChild(candyRed,candyPurple, candyOrange, candyGreen, candyYellow, candyBlue);

// create an array to store all the sprites
const candiesForBg = [];

const totalcandyRed = app.renderer instanceof PIXI.Renderer ? particleNum : 100;
const totalcandyBlue = app.renderer instanceof PIXI.Renderer ? particleNum : 100;
const totalcandyGreen = app.renderer instanceof PIXI.Renderer ? particleNum : 100;
const totalcandyOrange = app.renderer instanceof PIXI.Renderer ? particleNum : 100;
const totalcandyYellow = app.renderer instanceof PIXI.Renderer ? particleNum : 100;
const totalcandyPurple = app.renderer instanceof PIXI.Renderer ? particleNum : 100;

function addParticles(colorComponent, totalSprites, color) {
    
    for (let i = 0; i < totalSprites; i++) {
        // create a new Sprite
        let texture = new PIXI.Texture.from(`./img/${color}.png`)
        let candyBg = new PIXI.Sprite(texture)
        // set the anchor point so the texture is centerd on the sprite
        candyBg.anchor.set(0.5);
        candyBg.alpha = .4
        // different candiesForBg, different sizes
        candyBg.scale.set(0.8 + Math.random() * 0.3);
    
        // scatter them all
        candyBg.x = Math.random() * app.screen.width;
        candyBg.y = Math.random() * app.screen.height;
    
        // candyBg.tint = Math.random() * 0xBF40BF;
    
        // create a random direction in radians
        candyBg.direction = Math.random() * Math.PI * 2;
    
        // this number will be used to modify the direction of the sprite over time
        candyBg.turningSpeed = Math.random() - 0.8;
    
        // create a random speed between 0 - 2, and these candiesForBg are slooww
        candyBg.speed = (2 + Math.random() * 2) * 0.2;
    
        candyBg.offset = Math.random() * 100;
    
        // finally we push the candyBg into the candiesForBg array so it it can be easily accessed later
        candiesForBg.push(candyBg);
    
        colorComponent.addChild(candyBg);
    }
}

addParticles(candyRed, totalcandyRed, candies[0])
addParticles(candyBlue, totalcandyBlue, candies[1])
addParticles(candyGreen, totalcandyGreen, candies[2])
addParticles(candyOrange, totalcandyOrange, candies[3])
addParticles(candyYellow, totalcandyYellow, candies[4])
addParticles(candyPurple, totalcandyPurple, candies[5])

// create a bounding box box for the little candiesForBg
const candyBgBoundsPadding = 100;
const candyBgBounds = new PIXI.Rectangle(
    -candyBgBoundsPadding,
    -candyBgBoundsPadding,
    app.screen.width + candyBgBoundsPadding * 2,
    app.screen.height + candyBgBoundsPadding * 2,
);

app.stage.addChild(candyGridGraphic)
app.stage.addChild(candyGrid)

scoreContainer.addChild(scoreText1);
scoreContainer.addChild(scoreText2);
app.stage.addChild(scoreContainer);

// initialise game
createGrid()
gameLoop(0)

// creates initial game board full of candies
function createGrid() {
    let done = false 
    //  will loop until the board does not have candies 3 or more in a line
    while (!done) {
        for (let c = 0; c < cols; c++) {
            candyGridArray[c] = [];
            for (let r = 0; r < rows; r++) {
                let texture = PIXI.Texture.from(`./img/${randomCandy()}.png`)
                let candy = new PIXI.Sprite(texture)
                candy.anchor.set(0.5);
                candy.interactive = true
                candy.buttonMode = true;
                candyGridArray[c][r] = { sprite: candy, shift:0 }
            }
        }

        findThreeOrMore()
        if (clusters.length <= 0) {
            done = true
        }
    }
}

// event listeners

function gameLoop(time) {
    // if gamestate is false update with animations
    updateGrid(time)
    scoreText2.text = score
    // borderGraphic.rotation += .01
    drawCandy()
    
    // update background candies positions
    for (let i = 0; i < candiesForBg.length; i++) {
        const candyBg = candiesForBg[i];
        candyBg.scale.y = 0.95 + Math.sin(time + candyBg.offset) * 0.05;
        candyBg.direction += candyBg.turningSpeed * 0.01;
        candyBg.x += Math.sin(candyBg.direction) * (candyBg.speed * candyBg.scale.y);
        candyBg.y += Math.cos(candyBg.direction) * (candyBg.speed * candyBg.scale.y);
        candyBg.rotation = -candyBg.direction + Math.PI;

        // wrap the candiesForBg
        if (candyBg.x < candyBgBounds.x) {
            candyBg.x += candyBgBounds.width;
        } else if (candyBg.x > candyBgBounds.x + candyBgBounds.width) {
            candyBg.x -= candyBgBounds.width;
        }

        if (candyBg.y < candyBgBounds.y) {
            candyBg.y += candyBgBounds.height;
        } else if (candyBg.y > candyBgBounds.y + candyBgBounds.height) {
            candyBg.y -= candyBgBounds.height;
        }
    }

    requestAnimationFrame(gameLoop);
}

function updateGrid(time) {
    let dt = (time - lastTime) / 1000;
    lastTime = time;

    if (gamestate === false) {
        candyGrid.interactive = false
        // move and animate candy
        animationtime += dt;
        if (animationstate === 0) {
            if (animationtime > animationtimetotal) {
                findThreeOrMore()
                if (clusters.length > 0) {
                    // Add points to the score
                    for (var i=0; i<clusters.length; i++) {
                        // Add extra points for longer clusters
                        score += 30 * (clusters[i].length - 2);
                        scoreText2.style.fontSize += 3
                        app.stage.addChild(fireworkContainer1, fireworkContainer2, fireworkContainer3,fireworkContainer4)
                        fireworks1.play()
                        fireworks2.play()
                        fireworks3.play()
                        fireworks4.play()
                    }

                    removeThreeOrMore();
                    animationstate = 1;

                } else {
                    // No clusters found, animation complete
                    continueGame()
                }
                animationtime = 0;
            }
        } else if (animationstate === 1) {
            if (animationtime > animationtimetotal) {

                // Shift tiles
                moveCandyDown();
                
                // New clusters need to be found
                animationstate = 0;
                animationtime = 0;
                
                // Check if there are new clusters
                findThreeOrMore();
                if (clusters.length <= 0) {
                    // Animation complete
                    continueGame()
                }
            }
        } else if (animationstate === 2) {
            // Swapping tiles animation
            if (animationtime > animationtimetotal) {
                // Swap the tiles
                swap(currentmove.column1, currentmove.row1, currentmove.column2, currentmove.row2);
                
                // Check if the swap made a cluster
                findThreeOrMore();
                if (clusters.length > 0) {
                    // Valid swap, found one or more clusters
                    // Prepare animation states
                    animationstate = 0;
                    animationtime = 0;
                    gamestate = false;
                } else {
                    // Invalid swap, Rewind swapping animation
                    animationstate = 3;
                    animationtime = 0;
                }
                
                findThreeOrMore();
            }
        } else if (animationstate === 3) {
            // Rewind swapping animation
            if (animationtime > animationtimetotal) {
                // Invalid swap, swap back
                swap(currentmove.column1, currentmove.row1, currentmove.column2, currentmove.row2);
                
                // Animation complete
                continueGame()
            }
        }
        
        findThreeOrMore()
    }
}

function continueGame() {
        gamestate = true;
        candyGrid.interactive = true
        scoreText2.style.fontSize = 30
        app.stage.removeChild(fireworkContainer1, fireworkContainer2, fireworkContainer3,fireworkContainer4)
}

function findThreeOrMore() {
    clusters = []
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
                if (matchlength >= 3) {
                    clusters.push({row: i+1-matchlength,col: j, length: matchlength, horizontal: false})
                }
                matchlength = 1
            }
        }
    }
    // row check
    for (var i=0; i< rows; i++) {
        var matchlength = 1;
        for (var j=0; j<cols; j++) {
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
                    clusters.push({ row: i, col: j+1-matchlength,
                                    length: matchlength, horizontal: true });
                }
                
                matchlength = 1;
            }
        }
    }
}

function removeThreeOrMore() {
    for (var i=0; i< clusters.length; i++) {
        let line = clusters[i]
        let colOffset = 0
        let rowOffset = 0
        for (var j=0; j<line.length; j++) {
            changeToBlankTexture(line.col + colOffset, line.row + rowOffset)
            if (line.horizontal) {
                colOffset++;
            } else {
                rowOffset++;
            }
        }
    }
}

function moveCandyDown() {
    for (let c = 0; c < cols; c++) {
        let shift = 0
        for (let r = rows -1; r >= 0; r--) {
            if (candyGridArray[r][c].sprite.texture === blankTexture) {
                shift++
                // blank squares will not move so shift 0
                candyGridArray[r][c].shift = 0
            } else {
                candyGridArray[r][c].shift = shift
            }
        }
    }

    for (let c = 0; c < cols; c++) {
        for (let r = rows-1; r >= 0; r--) {
            if (candyGridArray[r][c].sprite.texture === blankTexture) {
                candyGridArray[r][c].sprite.texture = PIXI.Texture.from(`./img/${randomCandy()}.png`)
            } else {
                let shift = candyGridArray[r][c].shift;
                if (shift > 0) {
                    swap(c, r, c, r+shift)
                }
            }
            candyGridArray[r][c].shift = 0;
        }
    }
}

function changeToBlankTexture(col, row) {
    let candy = candyGridArray[row][col].sprite
    candy.texture = blankTexture
}

function drawCandy() {
    candyGrid.removeChildren()
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let shift = candyGridArray[r][c].shift;
            let candyContainer = new PIXI.Container()
            let candy = candyGridArray[r][c].sprite
            if (candy) {
                candy.x = 60 + (c + shift * animationtime/animationtimetotal) * 60
                candy.y = 60 + r * 60
                candy.alpha = 1
                candyContainer.addChild(candy)
                candyGrid.addChild(candyContainer)
            }
        }
    }
    if (selectedCandy.selected) {
        candyGridArray[selectedCandy.row][selectedCandy.col].sprite.alpha = 0.5
    }
}

// event listener func
function onMouseDown(e) {
    let pos = app.renderer.plugins.interaction.mouse.global
    // console.log(candyGridArray)
    if (!drag) {
        // convert pos x and y to candy tile
        let click = getMouseTile(pos)
        var swapped = false;
        if (click.valid){
            // for second click
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
            // for first click
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
    var tx = Math.floor((pos.x -candyGrid.x) / 65);
    var ty = Math.floor((pos.y -candyGrid.y) / 65);
    
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

function mouseSwap(c1, r1, c2, r2) {
    // console.log("swap")
    currentmove = {column1: c1, row1: r1, column2: c2, row2: r2};
    selectedCandy.selected = false;

    // Start animation
    animationstate = 2;
    animationtime = 0;
    gamestate = false;
}

function swap(c1, r1, c2, r2) {
    let spriteswap = candyGridArray[r1][c1].sprite;
    candyGridArray[r1][c1].sprite = candyGridArray[r2][c2].sprite;
    candyGridArray[r2][c2].sprite = spriteswap;
    // candyGridArray[y2][x2].moveTo(30, 30);
}
