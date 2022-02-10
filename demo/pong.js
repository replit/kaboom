kaboom({
	background: [ 255, 255, 128 ],
})

// add paddles
add([
	pos(40, 0),
	rect(20, 80),
	outline(4),
	origin("center"),
	area(),
	"paddle",
])

add([
	pos(width() - 40, 0),
	rect(20, 80),
	outline(4),
	origin("center"),
	area(),
	"paddle",
])

// move paddles with mouse
onUpdate("paddle", (p) => {
	p.pos.y = mousePos().y
})

// score counter
let score = 0

add([
	text(score),
	pos(center()),
	origin("center"),
	z(50),
	{ update() { this.text = score }},
])

// ball
let speed = 480

const ball = add([
	pos(center()),
	circle(16),
	outline(4),
	area({ width: 32, height: 32, offset: vec2(-16) }),
	{ vel: dir(rand(-20, 20)) },
])

// move ball, bounce it when touche horizontal edges, respawn when touch vertical edges
ball.onUpdate(() => {
	ball.move(ball.vel.scale(speed))
	if (ball.pos.x < 0 || ball.pos.x > width()) {
		score = 0
		ball.pos = center()
		ball.vel = dir(rand(-20, 20))
		speed = 320
	}
	if (ball.pos.y < 0 || ball.pos.y > height()) {
		ball.vel.y = -ball.vel.y
	}
})

// bounce when touch paddle
ball.onCollide("paddle", (p) => {
	speed += 60
	ball.vel = dir(ball.pos.angle(p.pos))
	score++
})
