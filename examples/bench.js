// bench marking sprite rendering performance

kaboom()

loadSprite("bean", "sprites/bean.png")
loadSprite("bag", "sprites/bag.png")

for (let i = 0; i < 3000; i++) {
	add([
		sprite("bean"),
		pos(rand(-width(), width() * 2), rand(-height(), height() * 2)),
		anchor("center"),
	])
	add([
		sprite("bag"),
		pos(rand(-width(), width() * 2), rand(-height(), height() * 2)),
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
