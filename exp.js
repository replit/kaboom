


// a list of components composes an entity / game object
add([
	sprite("froggy"),
	pos(100, 100),
]);

// component definition
function sprite(id) {
	return {
		_spriteID: id,
		_curAnim: undefined,
		frame: 0,
		// events
		update() {
			// maybe iterate over animation frames here
			this.frame = (this.frame + 1) % this.frameLen;
		},
		draw() {
			// calling the lower level draw funcs
			drawSprite(id, /* ... */);
		},
		// custom functions
		play(name) {
			this._curAnim = name;
		},
	};
}

