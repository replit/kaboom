kaboom()

add([
	pos(80, 80),
	circle(40),
	color(BLUE),
	"shape",
	{
		getShape() {
			return new Circle(vec2(), this.radius)
		},
	},
])

add([
	pos(180, 210),
	circle(20),
	color(BLUE),
	"shape",
	{
		getShape() {
			return new Circle(vec2(), this.radius)
		},
	},
])

add([
	pos(40, 180),
	rect(20, 40),
	color(BLUE),
	"shape",
	{
		getShape() {
			return new Rect(vec2(), this.width, this.height)
		},
	},
])

add([
	pos(140, 130),
	rect(60, 50),
	color(BLUE),
	"shape",
	{
		getShape() {
			return new Rect(vec2(), this.width, this.height)
		},
	},
])

add([
	pos(190, 40),
	rotate(45),
	polygon([vec2(-60, 60), vec2(0, 0), vec2(60, 60)]),
	color(BLUE),
	"shape",
	{
		getShape() {
			return new Polygon(this.pts)
		},
	},
])

add([
	pos(280, 130),
	polygon([vec2(-20, 20), vec2(0, 0), vec2(20, 20)]),
	color(BLUE),
	"shape",
	{
		getShape() {
			return new Polygon(this.pts)
		},
	},
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
		},
	},
])

add([
	pos(260, 80),
	color(BLUE),
	rotate(45),
	rect(30, 60),
	"shape",
	{
		getShape() {
			return new Rect(vec2(0, 0), 30, 60)
		},
	},
])

add([
	pos(280, 200),
	color(BLUE),
	"shape",
	{
		getShape() {
			return new Ellipse(vec2(), 80, 30)
		},
		draw() {
			drawEllipse({
				radiusX: 80,
				radiusY: 30,
				color: this.color,
			})
		},
	},
])

add([
	pos(340, 120),
	color(BLUE),
	"shape",
	{
		getShape() {
			return new Ellipse(vec2(), 40, 15, 45)
		},
		draw() {
			pushRotate(45)
			drawEllipse({
				radiusX: 40,
				radiusY: 15,
				color: this.color,
			})
			popTransform()
		},
	},
])

function getGlobalShape(s) {
	const t = s.transform
	return s.getShape().transform(t)
}

onUpdate(() => {
	const shapes = get("shape")
	shapes.forEach(s1 => {
		if (shapes.some(s2 => s1 !== s2 && getGlobalShape(s1).collides(getGlobalShape(s2)))) {
			s1.color = RED
		}
		else {
			s1.color = BLUE
		}
	})
})

onDraw(() => {
	const shapes = get("shape")
	shapes.forEach(s => {
		const shape = getGlobalShape(s)
		//console.log(tshape)
		switch (shape.constructor.name) {
			case "Ellipse":
				pushTransform()
				pushTranslate(shape.center)
				pushRotate(shape.angle)
				drawEllipse({
					pos: vec2(),
					radiusX: shape.radiusX,
					radiusY: shape.radiusY,
					fill: false,
					outline: {
						width: 4,
						color: rgb(255, 255, 0),
					},
				})
				popTransform()
				break
			case "Polygon":
				drawPolygon({
					pts: shape.pts,
					fill: false,
					outline: {
						width: 4,
						color: rgb(255, 255, 0),
					},
				})
				break
		}
	})
})

onMousePress(() => {
	const shapes = get("shape")
	const pos = mousePos()
	const pickList = shapes.filter((shape) => getGlobalShape(shape).contains(pos))
	selection = pickList[pickList.length - 1]
	if (selection) {
		get("selected").forEach(s => s.unuse("selected"))
		selection.use("selected")
	}
})

onMouseMove((pos, delta) => {
	get("selected").forEach(sel => {
		sel.moveBy(delta)
	})
	get("turn").forEach(laser => {
		const oldVec = mousePos().sub(delta).sub(laser.pos)
		const newVec = mousePos().sub(laser.pos)
		laser.angle += oldVec.angleBetween(newVec)
	})
})

onMouseRelease(() => {
	get("selected").forEach(s => s.unuse("selected"))
	get("turn").forEach(s => s.unuse("turn"))
})