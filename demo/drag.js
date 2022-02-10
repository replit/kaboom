// Drag & drop interaction

kaboom()

loadSprite("bean", "/sprites/bean.png")

// Keep track of the current draggin item
let curDraggin = null

// A custom component for handling drag & drop behavior
function drag() {

	// The displacement between object pos and mouse pos
	let offset = vec2(0)

	return {
		// Name of the component
		id: "drag",
		// This component requires the "pos" and "area" component to work
		require: [ "pos", "area" ],
		// "add" is a lifecycle method gets called when the obj is added to scene
		add() {
			// TODO: these need to be checked in reverse order
			// "this" in all methods refer to the obj
			this.onClick(() => {
				if (curDraggin) {
					return
				}
				curDraggin = this
				offset = mousePos().sub(this.pos)
				// Remove the object and re-add it, so it'll be drawn on top
				readd(this)
			})
		},
		// "update" is a lifecycle method gets called every frame the obj is in scene
		update() {
			if (curDraggin === this) {
				cursor("move")
				this.pos = mousePos().sub(offset)
			}
		},
	}

}

// drop
onMouseRelease(() => {
	curDraggin = null
})

// adding dragable objects
for (let i = 0; i < 48; i++) {
	add([
		sprite("bean"),
		pos(rand(width()), rand(height())),
		area(),
		scale(5),
		origin("center"),
		// using our custom component here
		drag(),
		i !== 0 ? color(255, 255, 255) : color(255, 0, 255),
	])
}

// reset cursor to default at frame start for easier cursor management
onUpdate(() => cursor("default"))
