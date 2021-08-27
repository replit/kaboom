kaboom({
	fullscreen: true,
	scale: 2,
});

loadRoot("/assets/");
loadSprite("mark", "sprites/mark.png");

// custom component to detect if obj is out of screen
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
				// triggers a custom event
				this.trigger("out");
			}
		},
	};
}

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

// binds a custom event "out" to tag group "mark"
on("out", "mark", (m) => {
	debug.log("out");
	destroy(m);
});
