kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
// gotta load the image first
loadSprite("mark", "img/mark.png");

// a custom component handling drag
const drag = defComp("drag", [ "pos", "area", ], () => {

	let offset = vec2(0);

	return {
		// "add" is a special lifecycle method gets called when the obj is added to scene
		add() {
			// "this" in all methods refer to the obj
			this.clicks(() => {
				if (sceneData("curDraggin")) {
					return;
				}
				sceneData("curDraggin", this);
				offset = mousePos().sub(this.pos);
				readd(this);
			});
		},
		// "update" is a special lifecycle method gets called every frame the obj is in scene
		update() {
			if (sceneData("curDraggin") === this) {
				this.pos = mousePos().sub(offset);
			}
		},
	};

});

scene("main", () => {

	// there should only be one that's currently being dragged
	sceneData("curDraggin", null);

	mouseRelease(() => {
		sceneData("curDraggin", null);
	});

	for (let i = 0; i < 64; i++) {
		add([
			sprite("mark"),
			pos(rand(width()), rand(height())),
			scale(5),
			origin("center"),
			drag(),
			i !== 0 ? color(1, 1, 1) : color(1, 0, 1),
		]);
	}

});

start("main");
