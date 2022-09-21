// Build levels with addIsometricLevel()

// Start game
kaboom()

// Load assets
loadSprite("grass", "/sprites/iso_grass.png")
loadSprite("darker_grass", "/sprites/iso_grass_darker.png")

gravity(0)
camScale(0.33)
camPos(vec2(100, 1000))

addIsometricLevel([
	// Design the isometric level layout with symbols
	// 15x15 grid in this case so we have a perfect tiled square diamond shaped map
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@!@@@@!@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@!@@@!@@@@@",
	"@@@@@@!!!@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
], {
	// The size of each grid
	width: 144,
	height: 71,
	// Define what each symbol means (in components)
	"@": () => [
		sprite("grass"),
	],
	"!": () => [
		sprite("darker_grass"),
	],
})

addIsometricLevel([
	// 15x9 grid
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@!@@@@@@@",
	"@@@@@@@!@@@@@@@",
	"@@@@@@@!@@@@@@@",
	"@@@@@@@!@@@@@@@",
	"@@@@@@@!@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@!@@@@@@@",
	"@@@@@@@@@@@@@@@",
	"@@@@@@@@@@@@@@@",
], {
	width: 144,
	height: 71,
	"@": () => [
		sprite("grass"),
	],
	"!": () => [
		sprite("darker_grass"),
	],
	// The position of the top left block
	pos: vec2(0, 1200),
})
