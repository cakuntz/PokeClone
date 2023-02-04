// making, sizing, and giving context to a canvas element
const canvas = document.querySelector('canvas')
const ct = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576


// matrix for the collision data
const collisionsMap = []

// parsing the collision array into a matrix via stack methods
for (let i = 0; i < collisions.length; i+= OWTileWidth) {
    collisionsMap.push(collisions.slice(i, OWTileWidth + i))
}

const boundaries = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol > 1000)
        boundaries.push(new Boundary({
            position:{x: j * OWTileDimension + OWBGOffset.x, 
                      y: i * OWTileDimension + OWBGOffset.y}
        }))
    })
})

// this is how to get an image to show up
// you have to create a new image object, then specify its source
const OWBG = new Image()
OWBG.src = './Assets/OWMaps/OWMap.png'

const playerDownImage = new Image()
playerDownImage.src = './Assets/MCSprites/MCDown.png'

const playerUpImage = new Image()
playerUpImage.src = './Assets/MCSprites/MCUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './Assets/MCSprites/MCLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './Assets/MCSprites/MCRight.png'

const OWFG = new Image()
OWFG.src = './Assets/OWMaps/OWForeground.png'

const player = new Sprite({
    position: {x: canvas.width/2 - playerSheetPixelWidth/2,
               y: canvas.height/2 - playerSheetPixelHeight/8},
    image: playerDownImage,
    frames: {
        max: playerSheetFrames
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right:playerRightImage
    }
})

const background = new Sprite({
    position: {x: OWBGOffset.x , y: OWBGOffset.y},
    image: OWBG
})

const foreground = new Sprite({
    position: {x: OWBGOffset.x , y: OWBGOffset.y},
    image: OWFG
}) 

const keys = {
    w: { pressed: false},
    a: { pressed: false},
    s: { pressed: false},
    d: { pressed: false},
    ArrowUp: { pressed: false},
    ArrowLeft: { pressed: false},
    ArrowDown: { pressed: false},
    ArrowRight: { pressed: false},
}

// an array of everything that moves on keydown
// '...' is the spread operator. it adds the contents of one array to another in one dimension
const movables = [background, foreground, ...boundaries]

function rectangularCollision ({ rect1, rect2}){
    return(rect1.position.x + rect1.width - collisionAdjust >= rect2.position.x 
           && rect1.position.x <= rect2.position.x + rect2.width - collisionAdjust
           && rect1.position.y <= rect2.position.y + rect2.height - collisionAdjust
           && rect1.position.y + rect1.height - collisionAdjust >= rect2.position.y 
    )
}

// creating a recursive function to repeatedly call player movement
function animate() {
    window.requestAnimationFrame(animate)

    // drawing BG
    background.draw()

    // drawing boundaries
    boundaries.forEach(boundary => {
        boundary.draw()
   
    })

    // drawing player
    player.draw()

    // keypress and bound check
    let moving = true
    player.moving = false

    if((keys.w.pressed && lastKey === 'w' ) || (keys.ArrowUp.pressed && lastKey === 'ArrowUp' )) {
        player.moving = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(
            rectangularCollision({
                rect1: player,
                rect2: {...boundary, position: {
                                                x: boundary.position.x,
                                                y: boundary.position.y + movementSpeed
                                                }
                        }
            })
            ) {
            console.log('colliding')
            moving = false
            break
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.y += movementSpeed
            })
    } else if ((keys.a.pressed && lastKey === 'a' ) || (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft' )) {
        player.moving = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(
            rectangularCollision({
                rect1: player,
                rect2: {...boundary, position: {
                                                x: boundary.position.x + movementSpeed,
                                                y: boundary.position.y
                                                }
                        }
            })
            ) {
            console.log('colliding')
            moving = false
            break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.x += movementSpeed
        })
    } else if ((keys.s.pressed && lastKey === 's' ) || (keys.ArrowDown.pressed && lastKey === 'ArrowDown' )) {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(
            rectangularCollision({
                rect1: player,
                rect2: {...boundary, position: {
                                                x: boundary.position.x,
                                                y: boundary.position.y - movementSpeed
                                                }
                        }
            })
            ) {
            console.log('colliding')
            moving = false
            break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.y -= movementSpeed
        })
    } else if ((keys.d.pressed && lastKey === 'd' ) || (keys.ArrowRight.pressed && lastKey === 'ArrowRight' )) {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if(
            rectangularCollision({
                rect1: player,
                rect2: {...boundary, position: {
                                                x: boundary.position.x - movementSpeed,
                                                y: boundary.position.y
                                                }
                        }
            })
            ) {
            console.log('colliding')
            moving = false
            break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.x -= movementSpeed
        })
    }

    // drawing FG
    foreground.draw()
    
}

animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            lastKey = 'ArrowUp'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            lastKey = 'ArrowLeft'
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            lastKey = 'ArrowDown'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            lastKey = 'ArrowRight'
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break     
    }
})



