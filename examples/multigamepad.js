kaboom()
setGravity(2400)
setBackground(0, 0, 0)
loadSprite("bean", "/sprites/bean.png")

const playerColors = [
	rgb(252, 53, 43),
	rgb(0, 255, 0),
	rgb(43, 71, 252),
	rgb(255, 255, 0),
	rgb(255, 0, 255),
]

let playerCount = 0

function addPlayer(gamepad) {
	const player = add([
		pos(center()),
		anchor("center"),
		sprite("bean"),
		color(playerColors[playerCount]),
		area(),
		body(),
		doubleJump(),
	])

	playerCount++

	onUpdate(() => {
		const leftStick = gamepad.getStick("left")

		if (gamepad.isPressed("south")) {
			player.doubleJump()
		}

		if(leftStick.x !== 0) {
			player.move(leftStick.x * 400, 0)
		}
	})
}

// platform
add([
	pos(0, height()),
	anchor("botleft"),
	rect(width(), 140),
	area(),
	body({isStatic: true}),
])

// add players on every gamepad connect
onGamepadConnect((gamepad) => {
	addPlayer(gamepad)
})
