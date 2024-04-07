kaboom()
loadBean()

// spawn a bean that takes a second to fade in
const bean = add([
	sprite("bean"),
	pos(120, 80), 
	opacity(),        // opacity() component gives it opacity which is required for fadeIn
	fadeIn(),         // fadeIn() component makes it fade in
])

// spawn another bean that takes 5 seconds to fade in halfway
// SPOOKY!
let spookyBean = add([
	sprite("bean"),
	pos(240, 80),
	opacity(0.5),     // opacity() component gives it opacity which is required for fadeIn (set to 0.5 so it will be half transparent)
	fadeIn(5),        // fadeIn() component makes it fade in (set to 5 so that it takes 5 seconds to fade in)
])