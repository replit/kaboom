// Weilding the asset loader

kaboom()

let spr = null

loadSprite("bean", "/sprites/bean.png").catch((err) => {
	console.error(err)
}).then((data) => {
	spr = data
})

volume(0.1)

loadSound("bug", "/sounds/bug.mp3")
loadPedit("asd", "/sprites/test.pedit")
loadAseprite("ghosty", "/sprites/ghosty2.png", "/sprites/ghosty2.json")

onKeyPress("space", () => {
	play("/sounds/bug.mp3")
})

play("bug")

add([
	sprite("ghosty", { anim: "idle" }),
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

	drawSprite({
		sprite: "asd",
	})

	if (spr) {
		drawSprite({
			sprite: spr
		})
	}

	drawSprite({
		pos: vec2(60),
		sprite: "/sprites/bean.png",
	})

	drawText({
		text: loadProgress(),
	})

})
