// audio playback & control

kaboom();

loadSound("bell", "sounds/bell.mp3");
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");

// the music might not autoplay cuz some browser won't allow audio start before any user interaction
const music = play("OtherworldlyFoe", { loop: true, });

// adjust global volume
volume(0.5);

const label = add([
	text(),
]);

function updateText() {
	label.text = `
${music.paused() ? "paused" : "playing"}
time: ${music.time().toFixed(2)}
volume: ${music.volume().toFixed(2)}
detune: ${music.detune().toFixed(2)}
	`.trim();
}

updateText();

// update text every frame
action(updateText);

keyPress("space", () => {

	// pause / play music
	if (music.paused()) {
		music.play();
	} else {
		music.pause();
	}

	// play one off sound
	play("bell", {
		detune: randi(-12, 12) * 100,
	});

});

// adjust music properties through input
keyPress("up", () => music.volume(music.volume() + 0.1));
keyPress("down", () => music.volume(music.volume() - 0.1));
keyPress("left", () => music.detune(music.detune() - 100));
keyPress("right", () => music.detune(music.detune() + 100));
keyPress("escape", () => music.stop());
