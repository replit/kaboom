// Use state() component to handle basic AI

// Start kaboom
kaboom()

// Load assets
loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")

const SPEED = 320
const ENEMY_SPEED = 160
const BULLET_SPEED = 800

// Add player game object
const player = add([
	sprite("bean"),
	pos(80, 80),
	area(),
	origin("center"),
])

const enemy = add([
	sprite("ghosty"),
	pos(width() - 80, height() - 80),
	origin("center"),
	// This enemy cycle between 3 states, and start from "idle" state
	state("move", [ "idle", "attack", "move", ]),
])

// Run the callback once every time we enter "idle" state.
// Here we stay "idle" for 0.5 second, then enter "attack" state.
enemy.onStateEnter("idle", () => {
	wait(0.5, () => enemy.enterState("attack"))
})

// When we enter "attack" state, we fire a bullet, and enter "move" state after 1 sec
enemy.onStateEnter("attack", () => {

	wait(1, () => enemy.enterState("move"))

	// Don't do anything if player doesn't exist anymore
	if (!player.exists()) return

	const dir = player.pos.sub(enemy.pos).unit()

	add([
		pos(enemy.pos),
		move(dir, BULLET_SPEED),
		rect(12, 12),
		area(),
		cleanup(),
		origin("center"),
		color(BLUE),
		"bullet",
	])

})

enemy.onStateEnter("move", () => {
	wait(2, () => enemy.enterState("idle"))
})

// Like .onUpdate() which runs every frame, but only runs when the current state is "move"
// Here we move towards the player every frame if the current state is "move"
enemy.onStateUpdate("move", () => {
	if (!player.exists()) return
	const dir = player.pos.sub(enemy.pos).unit()
	enemy.move(dir.scale(ENEMY_SPEED))
})

// Have to manually call enterState() to trigger the onStateEnter("move") event we defined above.
enemy.enterState("move")

// Taking a bullet makes us disappear
player.onCollide("bullet", (bullet) => {
	destroy(bullet)
	destroy(player)
	addKaboom(bullet.pos)
})

// Register input handlers & movement
onKeyDown("left", () => {
	player.move(-SPEED, 0)
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
})

onKeyDown("up", () => {
	player.move(0, -SPEED)
})

onKeyDown("down", () => {
	player.move(0, SPEED)
})
