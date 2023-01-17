// bench marking sprite rendering performance

kaboom()

loadSprite("bean", "sprites/bean.png")
loadSprite("bag", "sprites/bag.png")

for (let i = 0; i < 5000; i++) {
	add([
		sprite(i % 2 === 0 ? "bean" : "bag"),
		pos(rand(0, width()), rand(0, height())),
		anchor("center"),
	])
}

onDraw(() => {
	drawText({
		text: debug.fps(),
		pos: vec2(width() / 2, height() / 2),
		anchor: "center",
		color: rgb(255, 127, 255),
	})
})
