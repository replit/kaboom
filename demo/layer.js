kaboom()

loadSprite("bean", "/sprites/bean.png")

// layer "ui" will be on top of layer "game", with "game" layer being the default
layers([
	"game",
	"ui",
], "game")

add([
	sprite("bean"),
	scale(5),
	// specify layer with layer() component
	layer("ui"),
	color(0, 0, 255),
])

// this obj doesn't have a layer() component, fallback on default "game" layer
add([
	sprite("bean"),
	pos(100, 100),
	scale(5),
])
