// Simple Button UI

kaboom({
	background: [135, 62, 132],
})

// reset cursor to default on frame start for easier cursor management
onUpdate(() => setCursor("default"))

function addButton(txt, p, f) {

	// add a parent background object
	const btn = add([
		rect(240, 80, { radius: 8 }),
		pos(p),
		area(),
		scale(1),
		anchor("center"),
		outline(4),
	])

	// add a child object that displays the text
	btn.add([
		text(txt),
		anchor("center"),
		color(0, 0, 0),
	])

	// onHoverUpdate() comes from area() component
	// it runs every frame when the object is being hovered
	btn.onHoverUpdate(() => {
		const t = time() * 10
		btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7)
		btn.scale = vec2(1.2)
		setCursor("pointer")
	})

	// onHoverEnd() comes from area() component
	// it runs once when the object stopped being hovered
	btn.onHoverEnd(() => {
		btn.scale = vec2(1)
		btn.color = rgb()
	})

	// onClick() comes from area() component
	// it runs once when the object is clicked
	btn.onClick(f)

	return btn

}

addButton("Start", vec2(200, 100), () => debug.log("oh hi"))
addButton("Quit", vec2(200, 200), () => debug.log("bye"))
