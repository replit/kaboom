const k = kaboom({
	global: false,
})

const { marea, mbody, Matter } = kmatter(k)

k.loadBean()

k.gravity(1)

const MIN_DIST = 24
const MAX_DIST = 64
const POS = k.vec2(200, 300)

const bird = k.add([
	k.pos(POS),
	// k.sprite("bean"),
	k.rect(24, 24),
	marea(),
	mbody(),
])

let shot = false
let dragging = null

Matter.Sleeping.set(bird.body, true)

bird.onClick(() => {
	if (shot) return
	dragging = k.vec2(k.mousePos().sub(bird.pos))
})

k.onUpdate(() => {
	if (dragging) {
		bird.pos = k.mousePos().sub(dragging)
		if (bird.pos.dist(POS) > MAX_DIST) {
			bird.pos = POS.add(bird.pos.sub(POS).unit().scale(MAX_DIST))
		}
	}
})

k.onMouseRelease(() => {
	if (shot) return
	if (dragging) {
		dragging = null
		const dist = bird.pos.dist(POS)
		if (dist >= MIN_DIST) {
			Matter.Sleeping.set(bird.body, false)
			Matter.Body.setVelocity(bird.body, POS.sub(bird.pos).scale(0.5))
			shot = true
		} else {
			bird.pos = POS
		}
	}
})

let drawing = null

k.onMousePress(() => {
	if (!dragging && k.isKeyDown("shift")) {
		drawing = k.mousePos()
	}
})

function makeRect(p1, p2) {
	const minX = Math.min(p1.x, p2.x)
	const minY = Math.min(p1.y, p2.y)
	const maxX = Math.max(p1.x, p2.x)
	const maxY = Math.max(p1.y, p2.y)
	return new k.Rect(k.vec2(minX, minY), maxX - minX, maxY - minY)
}

k.onDraw(() => {
	if (drawing) {
		const rect = makeRect(drawing, k.mousePos())
		k.drawRect({
			pos: rect.pos,
			width: rect.width,
			height: rect.height,
		})
	}
})

k.onKeyPress("escape", () => {
	drawing = null
	if (dragging) {
		dragging = null
		bird.pos = POS
	}
})

k.onMouseRelease(() => {
	if (!drawing) return
	const rect = makeRect(drawing, k.mousePos())
	k.add([
		k.pos(rect.pos),
		k.rect(rect.width, rect.height),
		marea(),
		mbody(),
	])
	drawing = null
})

k.add([
	k.pos(0, 400),
	k.rect(k.width(), 24),
	marea(),
	mbody({ isStatic: true }),
])

k.onKeyPress("r", () => {
	Matter.Sleeping.set(bird.body, true)
	bird.pos = POS
	shot = false
})
