// Weilding the asset loader

kaboom()

let spr = null

loadSprite("bean", "/sprites/bean.png").catch((err) => {
	console.error(err)
}).then((data) => {
	spr = data
})

add([
	sprite("bean"),
	pos(120)
])

add([
	sprite("/sprites/bean.png"),
	pos(180)
])

add([
	text("bean"),
	pos(200)
])

debug.log("hi")

onDraw(() => {

	drawText({
		text: "bean",
	})

// 	drawSprite({
// 		sprite: "bean",
// 	})

	if (spr) {
		drawSprite({
			sprite: spr
		})
	}

	drawSprite({
		pos: vec2(60),
		sprite: "/sprites/bean.png",
	})

})
