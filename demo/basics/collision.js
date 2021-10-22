// area() component gives objects the ability to check for collision between each other

kaboom();

loadSprite("bean", "sprites/bean.png");
loadSprite("apple", "sprites/apple.png");

const player = add([
	sprite("bean"),
	// must give the objects area() component to enable collision detection!
	area(),
]);

for (let i = 0; i < 12; i++) {
	add([
		sprite("apple"),
		pos(rand(0, width()), rand(0, height())),
		// both objects need to have area() to enable collision
		// can specify some options to tweak the area size
		area({ scale: 0.5 }),
		"apple",
	]);
}

// register an event that runs every time player collides with another object with tag "apple"
// the callback gets the collided object as the first argument
player.collides("apple", (apple) => {
	destroy(apple);
});

// enter inspect mode to check object bounding boxes
// can be also enabled by pressing F1 (can be turned off by specifying debug: false in init)
debug.inspect = true;
