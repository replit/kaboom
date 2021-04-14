// TALK: then we use add() to add the birdy to the scene
// TALK: a game object in kaboom consists of a list of components, describing its behaviors
// TALK: to make a birdy, we first give it a sprite("birdy") component so it knows what to draw

kaboom.global();

loadSprite("birdy", "/pub/img/birdy.png");

init();

scene("main", () => {

	const birdy = add([
		sprite("birdy"),
	]);

});

start("main");
