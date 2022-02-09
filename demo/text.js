kaboom()

loadFont("FROGBLOCK", "/fonts/FROGBLOCK.ttf").onLoad(() => {
	console.log("---")
	for (const v of document.fonts.values()) {
		console.log(v)
	}
	console.log("---")
})
// loadFont("zpix", "/fonts/zpix.ttf")

onLoad(() => {
	console.log("2---")
	for (const v of document.fonts.values()) {
		console.log(v)
	}
	console.log("2---")
})

onDraw(() => {
	drawText2({
		text: "123yygo^",
		font: isMouseDown() ? "FROGBLOCK" : "Sans-Serif",
		size: 64,
// 		pos: vec2(100),
		pos: mousePos(),
	})
	drawText2({
		text: "爱是宇宙",
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
