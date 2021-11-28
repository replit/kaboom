kaboom()

loadSprite("bean", "/sprites/bean.png")
loadSprite("ghosty", "/sprites/ghosty.png")

const nucleus = add([
	sprite("ghosty"),
	pos(center()),
	rotate(0),
	origin("center"),
])

// Add children
for (let i = 12; i < 24; i++) {

	nucleus.add([
	  sprite("bean"),
	  rotate(0),
	  origin(vec2(i, i).scale(0.25)),
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
