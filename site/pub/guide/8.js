// TALK: here we made a rectangle object with screen width and 12 height
// TALK: and by giving it a solid() component, kaboom knows it's a solid physics object and things can't move through it!
// TALK: now it's finally time to make it jump!

kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
loadSprite("birdy", "img/birdy.png");

scene("main", () => {

	const birdy = add([
		sprite("birdy"),
		pos(80, 80),
		body(),
	]);

	add([
		rect(width(), 12),
		pos(0, 280),
		origin("topleft"),
		solid(),
	]);

});

start("main");
