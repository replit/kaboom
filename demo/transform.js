kaboom();

// load sprite
loadSprite("kaboom", "/sprites/kaboom.png");

// load sprite to screen
const k = add([
	sprite("kaboom"),
	pos(center()),
	scale(10),
	rotate(0),
	// center point of position and rotation (default "topleft")
	origin("center"),
]);

// change scale and rotation every frame
k.onUpdate(() => {
	k.scale = wave(-5, 5, time());
	k.angle = time() * 60;
});
