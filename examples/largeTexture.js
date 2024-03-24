kaboom()

let cameraPosition = camPos()
let cameraScale = 1

// Loads a random 2500px image
loadSprite("bigyoshi", "/examples/sprites/YOSHI.png")

add([
	sprite("bigyoshi"),
])

// Adds a label
const label = make([
	text("Click and drag the mouse, scroll the wheel"),
])

add([
	rect(label.width, label.height),
	color(0, 0, 0),
])

add(label)

// Mouse handling
onUpdate(() => {
	if(isMouseDown("left") && isMouseMoved()) {
		cameraPosition = cameraPosition.sub(mouseDeltaPos().scale(1 / cameraScale))
		camPos(cameraPosition)
	}
})

onScroll((delta)=>{
	cameraScale = cameraScale * (1 - 0.1 * Math.sign(delta.y))
	camScale(cameraScale)
})
