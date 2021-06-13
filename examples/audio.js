
// Initializing kaboom
kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	clearColor: [0, 0, 0, 1],
});

// Loading Assets
loadRoot("/pub/examples/"); // For now there is no documentation for loadRoot function in https://kaboomjs.com/.
							// But this function is only used to load the Assets without typing the full path of the file.
							// For example in following code using loadSound function we need to type the full file path if we don't use loadRoot function.
							// i.e loadSound("wooosh", "/pub/examples/sounds/wooosh.mp3");
							// After loadRoot function is added in documentation we will put the link of the documentation as well.

loadSound("wooosh", "sounds/wooosh.mp3"); // For documentation of loadSound function visit "https://kaboomjs.com/#loadSound"
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");// In documentation there support for .mp3 file is not shown but it is supported.

// Creating scene
scene("main", () => {

	// The music might not autoplay cuz some browser won't allow audio start before any user interaction
	const music = play("OtherworldlyFoe", { loop: true, }); // For the documentation of play function visit "https://kaboomjs.com/#play"

	volume(0.5); // For the documentation of volume visit "https://kaboomjs.com/#volume"

	// Creating label variable to add text into the screen using add function
	// For the documentation of add visit "https://kaboomjs.com/#add"
	const label = add([
		text(), // For the documentation of text function visit "https://kaboomjs.com/#text"
	]);

	// Creating updateText function to display the state of music
	// i.e if the music is playing the text will be "playing" and is it is paused text will be "paused"

	/* For the documentation of the functions used in updateText function below
		paused: For now there is no documentation for paused function in https://kaboomjs.com/.
				This function returns boolean value i.e true or false according to the music is playing or not playing.
				If playing it returns true and it is stopped it returns false

		volume: For the documentation of volume visit "https://kaboomjs.com/#volume"
	*/
	function updateText() {
		label.text = `
			${music.paused() ? "paused" : "playing"}
			time: ${music.time().toFixed(2)}
			volume: ${music.volume()}
			detune: ${music.detune()}
					`.trim();
	}

	// Calling updateText function for first time
	updateText();

	// Code written inside action function is going to run every frame
	// So, updateText function will run every frame of game
	action(() => {
		updateText();
	});

	/* 
	   KeyPress function is going to run the callback function is the key provided inside the function is pressed
	   For documentation of keyPress visit "https://kaboomjs.com/#keyPress"
	 */
	keyPress("space", () => {

		if (music.paused()) { // For now there is no documentation for paused function in https://kaboomjs.com/.
			  				  // This function returns boolean value i.e true or false according to the music is playing or not playing.
		                      // If playing it returns true and it is stopped it returns false

		    music.play();	  // For documentation of play vist "https://kaboomjs.com/#play"              
		} else {
			music.pause();    // For now there is no documentation for pause function in https://kaboomjs.com/.
			  				  // This function pauses the music playing
		}

		play("wooosh");

	});

	keyPress("down", () => {
		music.volume(music.volume() - 0.1); // For the documentation of volume visit "https://kaboomjs.com/#volume"
	});

	keyPress("up", () => {
		music.volume(music.volume() + 0.1); // For the documentation of volume visit "https://kaboomjs.com/#volume"
	});

	keyPress("left", () => {
		music.detune(music.detune() - 100);
	});

	keyPress("right", () => {
		music.detune(music.detune() + 100);
	});

	keyPress("escape", () => {
		music.stop();
	});

});

start("main"); // start function to start the scene
