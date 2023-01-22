// Tweeeeeening!

kaboom({
	background: [141, 183, 255],
})

loadSprite("bean", "/sprites/bean.png")

const duration = 1
const easeTypes = Object.keys(easings)
let curEaseType = 0

const bean = add([
	sprite("bean"),
	pos(center()),
	rotate(0),
	anchor("center"),
])

const label = add([
	text(easeTypes[curEaseType], { size: 64 }),
	pos(24, 24),
])

add([
	text("Click anywhere & use arrow keys", { width: width() }),
	anchor("botleft"),
	pos(24, height() - 24),
])

onKeyPress("left", () => {
	curEaseType = curEaseType === 0 ? easeTypes.length - 1 : curEaseType - 1
	label.text = easeTypes[curEaseType]
})

onKeyPress("right", () => {
	curEaseType = (curEaseType + 1) % easeTypes.length
	label.text = easeTypes[curEaseType]
})

let curTween = null

onMousePress(() => {
	const easeType = easeTypes[curEaseType]
	// stop previous lerp, or there will be jittering
	if (curTween) curTween.cancel()
	// start the tween
	curTween = tween(
		// start value (accepts number, Vec2 and Color)
		bean.pos,
		// destination value
		mousePos(),
		// duration (in seconds)
		duration,
		// how value should be updated
		(val) => bean.pos = val,
		// interpolation function (defaults to easings.linear)
		easings[easeType],
	)
})
