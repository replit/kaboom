// Adding game objects to screen

// Start a kaboom game
kaboom()

// Load a sprite asset from "sprites/bean.png", with the name "bean"
loadSprite("bean", "/sprites/bean.png")

const bean = add([
	sprite("bean"),   // sprite() component makes it render as a sprite
	pos(120, 80),     // pos() component gives it position, also enables movement
	rotate(0),        // rotate() component gives it rotation
	anchor("center"), // anchor() component defines the pivot point (defaults to "topleft")
])

onMousePress(() => {
	tween(bean.pos.x, mousePos().x, 1, (val) => bean.pos.x = val, easings.easeOutBounce)
	tween(bean.pos.y, mousePos().y, 1, (val) => bean.pos.y = val, easings.easeOutBounce)
})
