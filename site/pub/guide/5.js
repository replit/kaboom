// TALK: then we give it a pos(80, 80) component to tell what position to draw on screen
// TALK: oops it looks like our birdy is too small

kaboom.global();

loadSprite("birdy", "/pub/img/birdy.png");

init();

scene("main", () => {

	const birdy = add([
		sprite("birdy"),
		pos(80, 80),
	]);

});

start("main");
