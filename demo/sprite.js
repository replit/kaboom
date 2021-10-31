// Sprite animation

// Start a kaboom game
kaboom({
	// Scale the whole game up
	scale: 4,
	// Set the default font
	font: "sinko",
})

// Loading a multi-frame sprite
loadSprite("dino", "/sprites/dino.png", {
	// The image contains 9 frames layed out horizontally, slice it into individual frames
	sliceX: 9,
	// Define animations
	anims: {
		"idle": {
			// Starts from frame 0, ends at frame 3
			from: 0,
			to: 3,
			// Frame per second
			speed: 5,
			loop: true,
		},
		"run": {
			from: 4,
			to: 7,
			speed: 10,
			loop: true,
		},
		// This animation only has 1 frame
		"jump": 8
	},
})

gravity(640)

// Add our player character
const player = add([
	sprite("dino"),
	pos(center()),
	origin("center"),
	area(),
	body(),
])

player.play("idle")

// Add a platform
add([
	rect(width(), 24),
	area(),
	outline(1),
	pos(0, height() - 24),
	solid(),
])

// Switch to "idle" or "run" animation when player hits ground
player.onGround(() => {
	if (!isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	} else {
		player.play("run")
	}
})

player.onAnimEnd("idle", () => {
	// You can also register an event that runs when certain anim ends
})

onKeyPress("space", () => {
	if (player.isGrounded()) {
		player.jump(240)
		player.play("jump")
	}
})

onKeyDown("left", () => {
	player.move(-120, 0)
	player.flipX(true)
	// .play() will reset to the first frame of the anim, so we want to make sure it only runs when the current animation is not "run"
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

onKeyDown("right", () => {
	player.move(120, 0)
	player.flipX(false)
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

onKeyRelease(["left", "right"], () => {
	// Only reset to "idle" if player is not holding any of these keys
	if (!isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	}
})

const getInfo = () => `
Anim: ${player.curAnim()}
Frame: ${player.frame}
`.trim()

// Add some text to show the current animation
const label = add([
	text(getInfo()),
	pos(4),
])

label.onUpdate(() => {
	label.text = getInfo()
})
