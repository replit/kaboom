kaboom()

add([
    pos(80, 80),
    circle(40),
    color(BLUE),
    "shape",
    {
        getShape() {
            return new Circle(this.pos, this.radius)
        }
    }
])

add([
    pos(180, 190),
    circle(20),
    color(BLUE),
    "shape",
    {
        getShape() {
            return new Circle(this.pos, this.radius)
        }
    }
])

add([
    pos(40, 180),
    rect(20, 40),
    color(BLUE),
    "shape",
    {
        getShape() {
            return new Rect(this.pos, this.width, this.height)
        }
    }
])

add([
    pos(140, 130),
    rect(40, 30),
    color(BLUE),
    "shape",
    {
        getShape() {
            return new Rect(this.pos, this.width, this.height)
        }
    }
])

add([
    pos(180, 40),
    polygon([vec2(-60, 60), vec2(0, 0), vec2(60, 60)]),
    color(BLUE),
    "shape",
    {
        getShape() {
            return new Polygon(this.pts.map((pt) => pt.add(this.pos)))
        }
    }
])

add([
    pos(280, 130),
    polygon([vec2(-20, 20), vec2(0, 0), vec2(20, 20)]),
    color(BLUE),
    "shape",
    {
        getShape() {
            return new Polygon(this.pts.map((pt) => pt.add(this.pos)))
        }
    }
])

add([
    pos(280, 80),
    color(BLUE),
    "shape",
    {
        draw() {
            drawLine({
                p1: vec2(30, 0),
                p2: vec2(0, 30),
                width: 4,
                color: this.color,
            })
        },
        getShape() {
            return new Line(vec2(30, 0).add(this.pos), vec2(0, 30).add(this.pos))
        }
    }
])

add([
    pos(260, 80),
    color(BLUE),
    "shape",
    {
        draw() {
            drawRect({
                pos: vec2(-1, -1),
                width: 3,
                height: 3,
                color: this.color
            })
        },
        getShape() {
            // This would be point if we had a real class for it
            return new Rect(vec2(-1, -1).add(this.pos), 3, 3)
        }
    }
])

onUpdate(() => {
    const shapes = get("shape")
    shapes.forEach(s1 => {
        if (shapes.some(s2 => s1 !== s2 && s1.getShape().collides(s2.getShape()))) {
            s1.color = RED
        }
        else {
            s1.color = BLUE
        }
    })
})

let selection

onMousePress(() => {
    const shapes = get("shape")
    const pos = mousePos()
    const pickList = shapes.filter((shape) => shape.getShape().contains(pos))
    selection = pickList[pickList.length - 1]
})

onMouseMove((pos, delta) => {
    if (selection) {
        selection.moveBy(delta)
    }
})

onMouseRelease(() => {
    selection = null
})