// Custom component

kaboom()

loadSprite("bean", "/sprites/bean.png")

// Components are just functions that returns an object that follows a certain format
function funky() {

	// Can use local closed variables to store component state
	let isFunky = false

	return {

		// ------------------
		// Special properties that controls the behavior of the component (all optional)

		// The name of the component
		id: "funky",
		// If this component depend on any other components
		require: [ "scale", "color" ],

		// Runs when the host object is added to the game
		add() {
			// E.g. Register some events from other components, do some bookkeeping, etc.
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
			// E.g. Custom drawXXX() operations.
		},

		// Runs when the host object is destroyed
		destroy() {
			// E.g. Clean up event handlers, etc.
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
	anchor("center"),
	scale(1),
	color(),
	area(),
	// Use our component here
	funky(),
	// Tags are empty components, it's equivalent to a { id: "friend" }
	"friend",
	// Plain objects here are components too and work the same way, except unnamed
	{
		coolness: 100,
		friends: [],
	},
])

onKeyPress("space", () => {
	// .coolness is from our unnamed component above
	if (bean.coolness >= 100) {
		// We can use .getFunky() provided by the funky() component now
		bean.getFunky()
	}
})

onKeyPress("r", () => {
	// .use() is on every game object, it adds a component at runtime
	bean.use(rotate(rand(0, 360)))
})

onKeyPress("escape", () => {
	// .unuse() removes a component from the game object
	bean.unuse("funky")
})

add([
	text("Press space to get funky", { width: width() }),
	pos(12, 12),
])
