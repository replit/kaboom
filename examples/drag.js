kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
// gotta load the image first
loadSprite("mark", "img/mark.png");

let curDraggin = null;

function drag() {

	let offset = vec2(0);

	return {
		id: "drag",
		require: [ "pos", "area", ],
		// "add" is a special lifecycle method gets called when the obj is added to scene
		add() {
			// "this" in all methods refer to the obj
			this.clicks(() => {
				if (curDraggin) {
					return;
				}
				curDraggin = this;
				offset = mousePos().sub(this.pos);
				readd(this);
			});
		},
		// "update" is a special lifecycle method gets called every frame the obj is in scene
		update() {
			if (curDraggin === this) {
				this.pos = mousePos().sub(offset);
			}
		},
	};

}

mouseRelease(() => {
	curDraggin = null;
});

for (let i = 0; i < 64; i++) {
	add([
		sprite("mark"),
		pos(rand(width()), rand(height())),
		area(),
		scale(5),
		origin("center"),
		drag(),
		i !== 0 ? color(1, 1, 1) : color(1, 0, 1),
	]);
}
