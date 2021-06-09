kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
// gotta load the image first
loadSprite("mark", "img/mark.png");

function out() {
	return {
		id: "out",
		require: [ "pos" ],
		update() {
			const spos = this.screenPos();
			if (
				spos.x < 0 ||
				spos.x > width() ||
				spos.y < 0 ||
				spos.y > height()
			) {
				this.trigger("out");
			}
		},
	};
}

scene("main", () => {

	const SPEED = 320;

	mouseClick(() => {
		const center = vec2(width() / 2, height() / 2);
		const mpos = mousePos();
		add([
			pos(center),
			sprite("mark"),
			origin("center"),
			out(),
			"mark",
			{
				dir: mpos.sub(center).unit(),
			},
		]);
	});

	action("mark", (m) => {
		m.move(m.dir.scale(SPEED));
	});

	on("out", "mark", (m) => {
		debug.log("out");
		destroy(m);
	});

});

start("main");
