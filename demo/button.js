// Simple Button UI

kaboom()

// reset cursor to default on frame start for easier cursor management
onUpdate(() => setCursor("default"))

function addButton(txt, p, f) {

	const btn = add([
		text(txt),
		pos(p),
		area(),
		scale(1),
		origin("center"),
	])

	// set cursor to "pointer" when button is hovered
	btn.onHover(() => setCursor("pointer"))
	btn.onClick(f)

	btn.onUpdate(() => {
		if (btn.isHovering()) {
			const t = time() * 10
			btn.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			)
			btn.scale = vec2(1.2)
		} else {
			btn.scale = vec2(1)
			btn.color = rgb()
		}
	})

}

addButton("Start", vec2(200, 100), () => debug.log("oh hi"))
addButton("Quit", vec2(200, 200), () => debug.log("bye"))
