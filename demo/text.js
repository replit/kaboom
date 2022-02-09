kaboom()

loadFont("FROGBLOCK", "/fonts/FROGBLOCK.ttf")
// loadFont("zpix", "/fonts/zpix.ttf")

onDraw(() => {
	drawText2({
		text: "123yygo^",
		font: isMouseDown() ? "FROGBLOCK" : "Sans-Serif",
		size: 64,
// 		pos: vec2(100),
		pos: mousePos(),
	})
	drawText2({
		text: "我爱你",
		font: "zpix",
		size: 160,
		color: rgb(0, 0, 255),
		pos: vec2(100),
	})
// 	drawText({
// 		text: "123",
// 		size: 64,
// 		pos: vec2(100)
// 	})
})
