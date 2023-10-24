kaboom(
)

// Add a thing that follows the mouse
var CURSOR = "cursor"

const cursor = add([
	circle(10),
	area(),
	pos(),
	CURSOR,
])

cursor.onMouseMove(pos => {
	cursor.pos = pos
})

// Make a weird shape
const poly = add([
	polygon([
		vec2(300,300),
		vec2(500,300),
		vec2(350,600),
		vec2(300,400),
	]),
	pos(80, 120),
	outline(4),
	area(),
	color(rgb(255,0,0)),
	opacity(0.2),
])

// Change the color when the cursor object collides with the polygon
poly.onCollide(CURSOR, () => {
	poly.color = poly.color.lighten(100)
})

poly.onCollideEnd(CURSOR, obj => {
	poly.color = poly.color.darken(100)
})
