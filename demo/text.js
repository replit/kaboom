kaboom()

loadFont2("Mattone", "/fonts/Mattone.woff2")

onDraw(() => {
	drawText2({
		text: "123",
		font: isMouseDown() ? "Mattone" : "zpix",
		size: 64,
// 		pos: vec2(100),
		pos: mousePos(),
	})
// 	drawText({
// 		text: "123",
// 		size: 64,
// 		pos: vec2(100)
// 	})
})
