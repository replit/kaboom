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

onMousePress(() => {
	const easeType = easeTypes[curEaseType]
	tween(bean.pos, mousePos(), duration, (val) => bean.pos = val, easings[easeType])
})
