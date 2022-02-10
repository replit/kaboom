// NOTE: children game obj is not usable yet, will come in next major release!

kaboom()

loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")

const nucleus = add([
	sprite("ghosty"),
	pos(center()),
	origin("center"),
])

// Add children
for (let i = 12; i < 24; i++) {

	nucleus.add([
		sprite("bean"),
		rotate(0),
		origin(vec2(i).scale(0.25)),
		{
			speed: i * 8,
		},
	])

}

nucleus.onUpdate(() => {

	nucleus.pos = mousePos()

	// update children
	nucleus.children.forEach((child) => {
		child.angle += child.speed * dt()
	})

})
