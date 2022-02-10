// Customizing the asset loader

kaboom({
	// Turn off the default loading screen and make our own
	loadingScreen: false,
})

let spr = null

// Every loadXXX() function returns a Asset<Data> where you can customize the error handling (by default it'll stop the game and log on screen), or deal with the raw asset data yourself instead of using a name.
loadSprite("bean", "/sprites/bean.png").onError((err) => {
	alert("oh no we failed to load bean")
}).onLoad((data) => {
	// The promise resolves to the raw sprite data
	spr = data
})

// load() adds a Promise under kaboom's management, which affects loadProgress()
// Here we intentionally stall the loading by 1sec to see the loading screen
load(wait(1, () => {
	loadAseprite("ghosty", "/sprites/ghosty2.png", "/sprites/ghosty2.json")
}))

// You can also use the handle returned by loadXXX() as the resource handle
const bugSound = loadSound("bug", "/sounds/bug.mp3")

volume(0.1)

onKeyPress("space", () => play(bugSound))

add([
	sprite("ghosty", { anim: "idle" }),
	pos(120),
	scale(3),
])

add([
	text("bean"),
	pos(200),
])

onDraw(() => {

	// A custom loading screen
	// loadProgress() gives you the current loading progress of all assets
	if (loadProgress() < 1) {
		drawRect({
			width: width(),
			height: height(),
			color: Color.BLUE,
		})
		drawText({
			text: loadProgress(),
		})
		return
	}

	if (spr) {
		drawSprite({
			// You can pass raw sprite data here instead of the name
			sprite: spr,
		})
	}

})
