kaboom()

add([
	pos(80, 80),
	circle(40),
	color(BLUE),
	area(),
])

add([
	pos(180, 210),
	circle(20),
	color(BLUE),
	area(),
])

add([
	pos(40, 180),
	rect(20, 40),
	color(BLUE),
	area(),
])

add([
	pos(140, 130),
	rect(60, 50),
	color(BLUE),
	area(),
])

add([
	pos(180, 40),
	polygon([vec2(-60, 60), vec2(0, 0), vec2(60, 60)]),
	color(BLUE),
	area(),
])

add([
	pos(280, 130),
	polygon([vec2(-20, 20), vec2(0, 0), vec2(20, 20)]),
	color(BLUE),
	area(),
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

onDraw("selected", (s) => {
	const bbox = s.worldArea().bbox()
	drawRect({
		pos: bbox.pos.sub(s.pos),
		width: bbox.width,
		height: bbox.height,
		outline: {
			color: YELLOW,
			width: 1,
		},
		fill: false,
	})
})

onMousePress(() => {
	const shapes = get("area")
	const pos = mousePos()
	const pickList = shapes.filter((shape) => shape.hasPoint(pos))
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

function laser() {
	return {
		draw() {
			drawTriangle({
				p1: vec2(-16, -16),
				p2: vec2(16, 0),
				p3: vec2(-16, 16),
				pos: vec2(0, 0),
				color: this.color,
			})
			if (this.showRing || this.is("turn")) {
				drawCircle({
					pos: vec2(0, 0),
					radius: 28,
					outline: {
						color: RED,
						width: 4,
					},
					fill: false,
				})
			}
			pushTransform()
			pushRotate(-this.angle)
			const MAX_TRACE_DEPTH = 3
			const MAX_DISTANCE = 400
			let origin = this.pos
			let direction = Vec2.fromAngle(this.angle).scale(MAX_DISTANCE)
			let traceDepth = 0
			while (traceDepth < MAX_TRACE_DEPTH) {
				const hit = raycast(origin, direction, ["laser"])
				if (!hit) {
					drawLine({
						p1: origin.sub(this.pos),
						p2: origin.add(direction).sub(this.pos),
						width: 1,
						color: this.color,
					})
					break
				}
				const pos = hit.point.sub(this.pos)
				// Draw hit point
				drawCircle({
					pos: pos,
					radius: 4,
					color: this.color,
				})
				// Draw hit normal
				drawLine({
					p1: pos,
					p2: pos.add(hit.normal.scale(20)),
					width: 1,
					color: BLUE,
				})
				// Draw hit distance
				drawLine({
					p1: origin.sub(this.pos),
					p2: pos,
					width: 1,
					color: this.color,
				})
				// Offset the point slightly, otherwise it might be too close to the surface
				// and give internal reflections
				origin = hit.point.add(hit.normal.scale(0.001))
				// Reflect vector
				direction = direction.reflect(hit.normal)
				traceDepth++
			}
			popTransform()
		},
		showRing: false,
	}
}

const ray = add([
	pos(150, 270),
	rotate(-45),
	anchor("center"),
	rect(64, 64),
	area(),
	laser(0),
	color(RED),
	opacity(0.0),
	"laser",
])

get("laser").forEach(laser => {
	laser.onHover(() => {
		laser.showRing = true
	})
	laser.onHoverEnd(() => {
		laser.showRing = false
	})
	laser.onClick(() => {
		get("selected").forEach(s => s.unuse("selected"))
		if (laser.pos.sub(mousePos()).slen() > 28 * 28) {
			laser.use("turn")
		}
		else {
			laser.use("selected")
		}
	})
})
