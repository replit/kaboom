// Use parent game object

kaboom()

loadSprite("bean", "/sprites/bean.png")

const ui = add([
	fixed(),
])

ui.add([
	sprite("bean"),
	scale(5),
	color(0, 0, 255),
])

add([
	sprite("bean"),
	pos(100, 100),
	scale(5),
])
