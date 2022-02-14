// Customizing the asset loader

kaboom({
	// Optionally turn off loading screen entirely
	// Unloaded assets simply won't be drawn
	// loadingScreen: false,
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
load(new Promise((res) => {
	// wait() won't work here because timers are not run during loading so we use setTimeout
	setTimeout(() => {
		loadAseprite("ghosty", "/sprites/ghosty2.png", "/sprites/ghosty2.json")
		res()
	}, 1000)
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

// Custom loading screen
onLoading((progress) => {

	// Draw a fullscreen rect to cover up the default screen
	drawRect({
		width: width(),
		height: height(),
		color: rgb(0, 0, 0),
	})

	drawCircle({
		pos: center(),
		radius: 32,
		end: map(progress, 0, 1, 0, 360),
	})

	drawText({
		text: "loading" + ".".repeat(wave(1, 4, time() * 12)),
		font: "sink",
		size: 24,
		origin: "center",
		pos: center().add(0, 80),
	})

})

onDraw(() => {
	if (spr) {
		drawSprite({
			// You can pass raw sprite data here instead of the name
			sprite: spr,
		})
	}
})
