// Kaboom as pure rendering lib (no component / game obj etc.)

kaboom()
loadSprite("bean", "/sprites/bean.png")

loadShader("spiral", null, `
uniform float u_time;
uniform vec2 u_mpos;
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec2 pp = uv - u_mpos;
	float angle = atan(pp.y, pp.x);
	float dis = length(pp);
	float c = sin(dis * 48.0 + u_time * 8.0 + angle);
	return vec4(c, c, c, 1);
}
`)

const t = (n = 1) => time() * n
const w = (a, b, n) => wave(a, b, t(n))
const px = 160
const py = 160
const doodles = []
const trail = []

const outline = {
	width: 4,
	color: rgb(0, 0, 0),
}

function drawStuff() {

	const mx = (width() - px * 2) / 2
	const my = (height() - py * 2) / 1
	const p = (x, y) => vec2(x, y).scale(mx, my).add(px, py)

	drawSprite({
		sprite: "bean",
		pos: p(0, 0),
		angle: t(40),
		anchor: "center",
		scale: w(1, 1.5, 4),
		color: rgb(w(128, 255, 4), w(128, 255, 8), 255),
	})

	drawRect({
		pos: p(1, 0),
		width: w(60, 120, 4),
		height: w(100, 140, 8),
		anchor: "center",
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
		// gradient: [ Color.RED, Color.BLUE ],
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
		colors: [
			rgb(w(128, 255, 8), 255, w(128, 255, 4)),
			rgb(255, w(128, 255, 8), w(128, 255, 4)),
			rgb(w(128, 255, 8), w(128, 255, 4), 255),
			rgb(255, 128, w(128, 255, 4)),
			rgb(w(128, 255, 8), w(128, 255, 4), 128),
		],
		outline,
	})

	drawText({
		text: "yo",
		pos: p(1, 1),
		anchor: "center",
		size: w(80, 120, 2),
		color: rgb(w(128, 255, 4), w(128, 255, 8), w(128, 255, 2)),
	})

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

}

// onDraw() is similar to onUpdate(), it runs every frame, but after all update events.
// All drawXXX() functions need to be called every frame if you want them to persist
onDraw(() => {

	const maskFunc = Math.floor(time()) % 2 === 0 ? drawSubtracted : drawMasked

	if (isKeyDown("space")) {
		maskFunc(() => {
			drawUVQuad({
				width: width(),
				height: height(),
				shader: "spiral",
				uniform: {
					"u_time": time(),
					"u_mpos": mousePos().scale(1 / width(), 1 / height()),
				},
			})
		}, drawStuff)
	} else {
		drawStuff()
	}

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
