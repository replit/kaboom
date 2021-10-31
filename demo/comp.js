// Custom component

kaboom()

loadSprite("bean", "/sprites/bean.png")

// Define a custom component called "funky"
// Components are just functions that returns an object that follows a special format
function funky() {

	// Can use local closed variables to store component state
	let isFunky = false

	return {

		// ------------------
		// Special properties that controls the behavior of the component (all optional)

		// The name of the component
		id: "funky",
		// If this component depend on any other components
		require: [ "scale", "color", ],

		// Runs when the host object is added to the game
		add() {
			debug.log("Prepare to get funky")
		},

		// Runs every frame as long as the host object exists
		update() {

			if (!isFunky) return

			// "this" in all component methods refers to the host game object
			// Here we're updating some properties provided by other components
			this.color = rgb(rand(0, 255), rand(0, 255), rand(0, 255))
			this.scale = rand(1, 2)

		},

		// Runs every frame (after update) as long as the host object exists
		draw() {
			// ...
		},

		// Runs when the host object is destroyed
		destroy() {
			debug.log("Someone stopped being funky?!?")
		},

		// Get the info to present in inspect mode
		inspect() {
			return isFunky ? "on" : "off"
		},

		// ------------------
		// All other properties and methods are directly assigned to the host object

		getFunky() {
			isFunky = true
		},

	}

}

const bean = add([
	sprite("bean"),
	pos(center()),
	origin("center"),
	scale(1),
	color(),
	area(),
	// Use our component here
	funky(),
])

onKeyPress(() => {
	// Let's goooooo
	bean.getFunky()
})

add([
	text("Press any key to get funky", { width: width() }),
	pos(12, 12),
])
