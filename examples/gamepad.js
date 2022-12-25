kaboom()

loadSprite("bean", "/sprites/bean.png")

const buttons = [
	"north",
	"east",
	"south",
	"west",
	"ltrigger",
	"rtrigger",
	"lshoulder",
	"rshoulder",
	"select",
	"start",
	"lstick",
	"rstick",
]

const positions = [
	vec2(340, 220),
	vec2(400, 280),
	vec2(340, 340),
	vec2(280, 280),
	vec2(140, 140),
	vec2(340, 140),
	vec2(140, 100),
	vec2(340, 100),
]

for(const position in positions) {
	const bean = add([
		sprite("bean"),
		pos(positions[position]),
		color(GREEN),
	])

	onGamepadButtonDown(buttons[position], () => {
		bean.color = RED
	})

	onGamepadButtonRelease(buttons[position], () => {
		bean.color = GREEN
	})
}