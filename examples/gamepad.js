kaboom()
setGravity(2400)
loadSprite("bean", "/sprites/bean.png")

scene("nogamepad", () => {
	add([
		text("No found/disconnected gamepad. Connect a gamepad to try this demo."),
	])

	onGamepadConnect(() => {
		go("game")
	})
})

scene("game", () => {

	const player = add([
		pos(center()),
		anchor("center"),
		sprite("bean"),
		area(),
		body(),
	])

	// platform
	add([
		pos(0, height()),
		anchor("botleft"),
		rect(width(), 140),
		area(),
		body({isStatic: true}),
	])

	onGamepadButtonPress("south", () => {
		player.jump()
	})

	onGamepadDisconnect(() => {
		go("nogamepad")
	})

	onGamepadStick("left", (v) => {
		if (v.x > 0.2) player.move(200, 0)
		else if (v.x < -0.2) player.move(-200, 0)
	})
})

if(getGamepads().length > 0) {
	go("game")
} else {
	go("nogamepad")
}
