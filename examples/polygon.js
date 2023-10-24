kaboom()

// Add a thing that follows the mouse
var CURSOR = "cursor"

const cursor = add([
	circle(10),
	area(),
	pos(),
	z(100),
	CURSOR,
])

cursor.onMouseMove(pos => {
	cursor.pos = pos
})

// Make a weird shape
const poly = add([
	polygon([
		vec2(0, 0),
		vec2(200, 0),
		vec2(50, 300),
		vec2(0, 100),
	]),
	pos(80, 120),
	outline(4),
	area(),
	color(rgb(255, 0, 0)),
])

// Change the color when the cursor object collides with the polygon
poly.onCollide(CURSOR, () => {
	poly.color = rgb(0, 0, 255)
})

poly.onCollideEnd(CURSOR, obj => {
	poly.color = rgb(255, 0, 0)
})
