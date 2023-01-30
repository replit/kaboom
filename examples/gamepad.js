kaboom()
setGravity(2400)
setBackground(0, 0, 0)
loadSprite("bean", "/sprites/bean.png")

scene("nogamepad", () => {
	add([
		text("Gamepad not found.\nConnect a gamepad and press a button!", {
			width: width() - 80,
			align: "center",
		}),
		pos(center()),
		anchor("center"),
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
