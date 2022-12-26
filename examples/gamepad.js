kaboom()

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
	gravity(2400)

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
})

if(getConnectedGamepads().length > 0) {
	go("game")
}
else {
	go("nogamepad")
}