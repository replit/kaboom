// Kaboom as pure rendering lib (no component / game obj etc.)

kaboom()
loadSprite("bean", "/sprites/bean.png")

const t = (n = 1) => time() * n
const w = (a, b, n) => wave(a, b, t(n))
const px = 160
const py = 200
const doodles = []
const trail = []

const outline = {
	width: 4,
	color: rgb(0, 0, 0),
}

// onDraw() is similar to onUpdate(), it runs every frame, but after all update events.
// All drawXXX() functions need to be called every frame if you want them to persist
onDraw(() => {

	const mx = (width() - px * 2) / 2
	const my = (height() - py * 2) / 1
	const p = (x, y) => vec2(x, y).scale(mx, my).add(px, py)

	// When "space" key is down, rotate the whole canvas from the center
	if (isKeyDown("space")) {
		pushTransform()
		pushTranslate(width() / 2, height() / 2)
		pushRotate(t(240))
		pushTranslate(-width() / 2, -height() / 2)
	}

	drawSprite({
		sprite: "bean",
		pos: p(0, 0),
		angle: t(40),
		origin: "center",
		scale: w(1, 1.5, 4),
		color: rgb(w(128, 255, 4), w(128, 255, 8), 255),
	})

	drawRect({
		pos: p(1, 0),
		width: w(60, 120, 4),
		height: w(100, 140, 8),
		origin: "center",
		radius: w(0, 32, 4),
		angle: t(80),
		color: rgb(w(128, 255, 4), 255, w(128, 255, 8)),
		outline,
	})

	drawEllipse({
		pos: p(2, 0),
		radiusX: w(40, 70, 2),
		radiusY: w(40, 70, 4),
		start: 0,
		end: w(180, 360, 1),
		color: rgb(255, w(128, 255, 8), w(128, 255, 4)),
		outline,
	})

	drawPolygon({
		pos: p(0, 1),
		pts: [
			vec2(w(-10, 10, 2), -80),
			vec2(80, w(-10, 10, 4)),
			vec2(w(30, 50, 4), 80),
			vec2(-30, w(50, 70, 2)),
			vec2(w(-50, -70, 4), 0),
		],
		color: rgb(w(128, 255, 8), 255, w(128, 255, 4)),
		outline,
	})

	drawText({
		text: "yo",
		pos: p(1, 1),
		origin: "center",
		size: w(80, 120, 2),
		color: rgb(w(128, 255, 4), w(128, 255, 8), w(128, 255, 2)),
	})

	// TODO: show a custom shader quad here

	// pop to not affect the mouse trail and draw
	if (isKeyDown("space")) {
		popTransform()
	}

	drawLines({
		...outline,
		pts: trail,
	})

	doodles.forEach((pts) => {
		drawLines({
			...outline,
			pts: pts,
		})
	})

})

// It's a common practice to put all input handling and state updates before rendering.
onUpdate(() => {

	trail.push(mousePos())

	if (trail.length > 16) {
		trail.shift()
	}

	if (isMousePressed()) {
		doodles.push([])
	}

	if (isMouseDown() && isMouseMoved()) {
		doodles[doodles.length - 1].push(mousePos())
	}

})
