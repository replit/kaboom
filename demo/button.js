// Simple Button UI

kaboom({
	background: [135, 62, 132],
})

// reset cursor to default on frame start for easier cursor management
onUpdate(() => setCursor("default"))

function addButton(txt, p, f) {

	const btn = add([
		rect(240, 80, { radius: 8 }),
		pos(p),
		area(),
		scale(1),
		anchor("center"),
		outline(4),
	])

	btn.add([
		text(txt),
		anchor("center"),
		color(0, 0, 0),
	])

	btn.onHoverUpdate(() => {
		const t = time() * 10
		btn.color = rgb(
			wave(0, 255, t),
			wave(0, 255, t + 2),
			wave(0, 255, t + 4),
		)
		btn.scale = vec2(1.2)
		setCursor("pointer")
	})

	btn.onHoverEnd(() => {
		btn.scale = vec2(1)
		btn.color = rgb()
	})

	// set cursor to "pointer" when button is hovered
	btn.onClick(f)

	return btn

}

addButton("Start", vec2(200, 100), () => debug.log("oh hi"))
addButton("Quit", vec2(200, 200), () => debug.log("bye"))
