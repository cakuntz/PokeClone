class Sprite {

    // creating constructors this way makes it so the input order on call doesn't matter
    constructor({position, velocity, image, frames = {max: 1}, sprites = []}) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width
            this.height = this.image.height / this.frames.max
        }

        this.moving = false
        this.sprites = sprites
    }

    draw() {
        // drawImage args (image object,
        //                 x crop start, y crop start,
        //                 x crop end, y crop end, 
        //                 x offset, y offset,
        //                 x render size, y render size)
        ct.drawImage(this.image,
            0, this.frames.val * this.height,
            this.image.width, this.image.height / this.frames.max,
            this.position.x, this.position.y,
            this.image.width, this.image.height / this.frames.max)
        
        // increments playerSheet frame if moving every 10 frames
        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1)
                this.frames.val++
            else 
                this.frames.val = 0
        }
        
    }
    
}

class Boundary {
    constructor({position}) {
        this.position = position
        this.width = OWTileDimension
        this.height = OWTileDimension
    }

    draw() {
        ct.fillStyle = 'rgba(255, 0, 0, 0.0)'

        // args are (x start, y start, width, height)
        ct.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}