// Egg minigames (yes, like Peppa)

kaboom({
	background: [135, 62, 132],
})

loadSprite("bean", "/sprites/bean.png")
loadSprite("egg", "/sprites/egg.png")
loadSprite("egg_crack", "/sprites/egg_crack.png")

const player = add([
	sprite("bean"),
	pos(center()),
	anchor("center"),
	z(50),
])

const counter = add([
	text("0"),
	pos(24, 24),
	z(100),
	{ value: 0 },
])

// "shake" is taken, so..
function rock() {
	let strength = 0
	let time = 0
	return {
		id: "rock",
		require: [ "rotate" ],
		update() {
			if (strength === 0) {
				return
			}
			this.angle = Math.sin(time * 10) * strength
			time += dt()
			strength -= dt() * 30
			if (strength <= 0) {
				strength = 0
				time = 0
			}
		},
		rock(n = 15) {
			strength = n
		},
	}
}

onKeyPress("space", () => {

	add([
		sprite("egg"),
		pos(player.pos.add(0, 24)),
		rotate(0),
		anchor("bot"),
		rock(),
		"egg",
		{ stage: 0 },
	])

	player.moveTo(rand(0, width()), rand(0, height()))

})

// HATCH
onKeyPress("enter", () => {
	get("egg", { recursive: true }).forEach((e) => {
		if (e.stage === 0) {
			e.stage = 1
			e.rock()
			e.use(sprite("egg_crack"))
		} else if (e.stage === 1) {
			e.stage = 2
			e.use(sprite("bean"))
			addKaboom(e.pos.sub(0, e.height / 2))
			counter.value += 1
			counter.text = counter.value
		}
	})
})
