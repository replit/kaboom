kaboom()

const fruits = [
	"apple",
	"pineapple",
	"grape",
	"watermelon",
]

for (const fruit of fruits) {
	loadSprite(fruit, `/sprites/${fruit}.png`)
}

loadSprite("bean", "/sprites/bean.png")
loadSprite("heart", "/sprites/heart.png")
loadSound("hit", "/examples/sounds/hit.mp3")
loadSound("wooosh", "/examples/sounds/wooosh.mp3")

scene("start", () => {

	play("wooosh")

	add([
		text("Eat All"),
		pos(center().sub(0, 100)),
		scale(2),
		anchor("center"),
	])

	add([
		sprite("heart"),
		pos(center().add(0, 100)),
		scale(2),
		anchor("center"),
	])

	wait(1.5, () => go("game"))

})

// main game scene content
scene("game", () => {

	const SPEED_MIN = 120
	const SPEED_MAX = 640

	// add the player game object
	const player = add([
		sprite("bean"),
		pos(40, 20),
		area({ scale: 0.5 }),
		anchor("center"),
	])

	// make the layer move by mouse
	player.onUpdate(() => {
		player.pos = mousePos()
	})

	// game over if player eats a fruit
	player.onCollide("fruit", () => {
		go("lose", score)
		play("hit")
	})

	// move the food every frame, destroy it if far outside of screen
	onUpdate("food", (food) => {
		food.move(-food.speed, 0)
		if (food.pos.x < -120) {
			destroy(food)
		}
	})

	onUpdate("heart", (heart) => {
		if (heart.pos.x <= 0) {
			go("lose", score)
			play("hit")
			addKaboom(heart.pos)
		}
	})

	// score counter
	let score = 0

	const scoreLabel = add([
		text(score, 32),
		pos(12, 12),
	])

	// increment score if player eats a heart
	player.onCollide("heart", (heart) => {
		addKaboom(player.pos)
		score += 1
		destroy(heart)
		scoreLabel.text = score
		burp()
		shake(12)
	})

	// do this every 0.3 seconds
	loop(0.3, () => {

		// spawn from right side of the screen
		const x = width() + 24
		// spawn from a random y position
		const y = rand(0, height())
		// get a random speed
		const speed = rand(SPEED_MIN, SPEED_MAX)
		// 50% percent chance is heart
		const isHeart = chance(0.5)
		const spriteName = isHeart ? "heart" : choose(fruits)

		add([
			sprite(spriteName),
			pos(x, y),
			area({ scale: 0.5 }),
			anchor("center"),
			"food",
			isHeart ? "heart" : "fruit",
			{ speed: speed },
		])

	})

})

// game over scene
scene("lose", (score) => {

	add([
		sprite("bean"),
		pos(width() / 2, height() / 2 - 108),
		scale(3),
		anchor("center"),
	])

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 2 + 108),
		scale(3),
		anchor("center"),
	])

	// go back to game with space is pressed
	onKeyPress("space", () => go("start"))
	onClick(() => go("start"))

})

// start with the "game" scene
go("start")
