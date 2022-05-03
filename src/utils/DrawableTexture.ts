import { generateUUID } from "three/src/math/MathUtils"
import * as THREE from 'three'

type Point = {x: number, y: number, age: number, force: number, velocityX: number, velocityY: number}

function easeOutSine(t: number, b: number, c: number, d: number) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
};
  
function easeOutQuad(t: number, b: number, c: number, d: number) {
    t /= d;
    return -c * t * (t - 2) + b;
};

export class DrawableTexture {

    private readonly width = 60
    private readonly height = this.width

    private readonly maxAge = 200
    private readonly points: Point[] = []

    private readonly offset: number
    private readonly radius: number

    private readonly hiddenCanvas = document.createElement("canvas")
    private readonly ctx: CanvasRenderingContext2D = this.hiddenCanvas.getContext("2d")!

    private lastAddedPoint: Point | undefined

    readonly texture = new THREE.Texture(this.hiddenCanvas)

    constructor() {
        const UUID = generateUUID()

        this.radius = Math.min(this.width, this.height) * 0.333333
        this.offset = this.width * 5.

        this.hiddenCanvas.id = `drawableTexture${UUID}`
        this.hiddenCanvas.width = this.width
        this.hiddenCanvas.height = this.height

        this.ctx.shadowOffsetX = this.ctx.shadowOffsetY = this.offset
        this.ctx.shadowBlur = this.radius

        document.body.appendChild(this.hiddenCanvas)

        this.clear()
    }

    clear() {
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, this.hiddenCanvas.width, this.hiddenCanvas.height)
    }


    addPoint(pointData: {x: number, y: number}) {

        let force = 0;
        let velocityX = 0;
        let velocityY = 0;
        const last = this.lastAddedPoint;
        if (last) {
            const relativeX = pointData.x - last.x;
            const relativeY = pointData.y - last.y;
            // Distance formula
            const distanceSquared = relativeX * relativeX + relativeY * relativeY;
            const distance = Math.sqrt(distanceSquared);
            // Calculate Unit Vector
            velocityX = relativeX / distance;
            velocityY = relativeY / distance;

            force = Math.min(distanceSquared * 10000, 1);
        }

        this.lastAddedPoint = {
            x: pointData.x,
            y: pointData.y,
            age: 0,
            force,
            velocityX,
            velocityY 
        };
        this.points.push({...this.lastAddedPoint});
    }

    update() {
        this.clear();
        let agePart = 1 / this.maxAge;

        this.points.forEach((point, i) => {
            let slowAsOlder = 1 - point.age / this.maxAge;
            let force = point.force * agePart * slowAsOlder;
            point.x += point.velocityX * force;
            point.y += point.velocityY * force;
            point.age += 1;
            if (point.age > this.maxAge) {
                this.points.splice(i, 1);
            }
        });

        this.points.forEach(point => {
            this.drawPoint(point);
        });

        this.texture.needsUpdate = true
    }

    drawPoint(point: Point) {
        const ctx = this.ctx
        const position = {
            x: point.x * this.width,
            y: point.y * this.height
        }

        let intensity = 1;
        //intensity = 1 - point.age/this.maxAge
        if(point.age < this.maxAge * 0.3) {
            intensity = easeOutSine(point.age / (this.maxAge * .3),0,1,1)
        } else {
            intensity = easeOutQuad(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1)
        }
        intensity *= point.force

        let red = ((point.velocityX + 1) / 2) * 255;
        let green = ((point.velocityY + 1) / 2) * 255;
        // B = Unit vector
        let blue = point.force * 255;
        let color = `${red}, ${green}, ${blue}`;

        this.ctx.shadowColor = `rgba(${color}, ${.2 * intensity})`

        ctx.beginPath()
        ctx.fillStyle = "rgby(255,0,0,1)"
        ctx.arc(position.x - this.offset, position.y - this.offset, this.radius * 0.2 + this.radius * point.age/this.maxAge, 0, Math.PI * 2)
        ctx.fill()
    }
}