// Sprite animation

// Start a kaboom game
kaboom()

// Loading a multi-frame sprite
loadSprite("bean", "sprites/bean.png")

const player = add([
	sprite("bean"),
	pos(center()),
	origin("center"),
])

onKeyPress("left", () => {
	player.flipX(false)
})

onKeyPress("right", () => {
	player.flipX(true)
})

