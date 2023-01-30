kaboom()
setGravity(2400)
setBackground(141, 183, 255)
loadSprite("bean", "/sprites/bean.png")

scene("nogamepad", () => {
	add([
		text("Gamepad not found. Connect a gamepad or press a button on connected gamepad!.", { width: width() }),
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

	onGamepadButtonPress((b) => {
		debug.log(b)
	})

	onGamepadButtonPress("south", () => {
		player.jump()
	})

	onGamepadStick("left", (v) => {
		player.move(v.x * 400, 0)
	})

	onGamepadDisconnect(() => {
		go("nogamepad")
	})

})

if(getGamepads().length > 0) {
	go("game")
} else {
	go("nogamepad")
}
