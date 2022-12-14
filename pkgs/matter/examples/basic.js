const k = kaboom()
const { marea, mbody } = kmatter(k)

const me = k.add([
	k.pos(60, 120),
	k.rect(48, 24),
	marea(),
	k.rotate(45),
	k.anchor("center"),
	mbody(),
])

me.onCollideEnd((obj) => {
	console.log(obj)
})

k.add([
	k.pos(90, 120),
	k.rect(48, 24),
	marea(),
	k.rotate(45),
	// k.anchor("center"),
	mbody(),
])

k.add([
	k.pos(40, 160),
	k.rect(240, 24),
	marea(),
	// k.anchor("center"),
	mbody({ isStatic: true }),
])

const SPEED = 320
onKeyDown("left", () => {
	// .move() is provided by pos() component, move by pixels per second
	me.move(-SPEED, 0)
})

onKeyDown("right", () => {
	me.move(SPEED, 0)
})

onKeyDown("up", () => {
	me.move(0, -SPEED)
})

onKeyDown("down", () => {
	me.move(0, SPEED)
})

k.onKeyPress("space", () => {
	me.applyForce(mousePos(), vec2(0, -0.02))
})

k.onKeyPress("r", () => {
	me.angle = 90
})

k.debug.inspect = true
k.canvas.focus()
