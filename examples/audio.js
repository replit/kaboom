// audio playback & control

kaboom()

loadSound("bell", "/sounds/bell.mp3")
loadSound("OtherworldlyFoe", "/sounds/OtherworldlyFoe.mp3")

// play() to play audio
// (This might not play until user input due to browser policy)
const music = play("OtherworldlyFoe", {
	loop: true,
})

// Adjust global volume
volume(0.5)

const label = add([
	text(),
])

function updateText() {
	label.text = `
${music.isPaused() ? "Paused" : "Playing"}
Time: ${music.time().toFixed(2)}
Tolume: ${music.volume().toFixed(2)}
Tetune: ${music.detune().toFixed(2)}
	`.trim()
}

updateText()

// Update text every frame
onUpdate(updateText)

// Adjust music properties through input
onKeyPress("space", () => {
	if (music.isPaused()) {
		music.play()
	} else {
		music.pause()
	}
})

onKeyPress("up", () => music.volume(music.volume() + 0.1))
onKeyPress("down", () => music.volume(music.volume() - 0.1))
onKeyPress("left", () => music.detune(music.detune() - 100))
onKeyPress("right", () => music.detune(music.detune() + 100))
onKeyPress("escape", () => music.stop())

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
