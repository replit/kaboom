// bench marking sprite rendering performance

kaboom()

loadBean()

for (let i = 0; i < 5000; i++) {
	add([
		sprite("bean"),
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
