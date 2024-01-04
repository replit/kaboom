// audio playback & control

kaboom({
	// Don't pause audio when tab is not active
	backgroundAudio: true,
	background: [0, 0, 0],
})

loadSound("bell", "/examples/sounds/bell.mp3")
loadMusic("OtherworldlyFoe", "/examples/sounds/OtherworldlyFoe.mp3")

// play() to play audio
// (This might not play until user input due to browser policy)
const music = play("OtherworldlyFoe", {
	loop: true,
	paused: true,
})

// Adjust global volume
volume(0.5)

const label = add([
	text(),
])

function updateText() {
	label.text = `
${music.paused ? "Paused" : "Playing"}
Time: ${music.time().toFixed(2)}
Volume: ${music.volume.toFixed(2)}
Speed: ${music.speed.toFixed(2)}

[space] play/pause
[up/down] volume
[left/right] speed
	`.trim()
}

updateText()

// Update text every frame
onUpdate(updateText)

// Adjust music properties through input
onKeyPress("space", () => music.paused = !music.paused)
onKeyPressRepeat("up", () => music.volume += 0.1)
onKeyPressRepeat("down", () => music.volume -= 0.1)
onKeyPressRepeat("left", () => music.speed -= 0.1)
onKeyPressRepeat("right", () => music.speed += 0.1)
onKeyPress("m", () => music.seek(4.24))

const keyboard = "awsedftgyhujk"

// Simple piano with "bell" sound and the second row of a QWERTY keyboard
for (let i = 0; i < keyboard.length; i++) {
	onKeyPress(keyboard[i], () => {
		play("bell", {
			// The original "bell" sound is F, -500 will make it C for the first key
			detune: i * 100 - 500,
		})
	})
}

// Draw music progress bar
onDraw(() => {
	if (!music.duration()) return
	const h = 16
	drawRect({
		pos: vec2(0, height() - h),
		width: music.time() / music.duration() * width(),
		height: h,
	})
})
