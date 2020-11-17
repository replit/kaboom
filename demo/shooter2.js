// callback model, no explicit run loop, storing all the callback functions in memory and call on time
loadSprite("guy", "guy.png");
loadSound("shoot", "shoot.ogg");

scene("main", () => {

	const bulletSpeed = 1280;

	let player = add({
		sprite: "frog",
		pos: vec2(0, -160),
		speed: 480,
	});

// 	add({
// 		sprite: "frog",
// 		pos: vec2(0, 160),
// 		tags: [ "enemy", ],
// 	});

// 	keyPress(" ", () => {

// 		play("shoot");

// 		add({
// 			sprite: "bullet",
// 			pos: player.pos,
// 			speed: bulletSpeed,
// 			tags: [ "bullet", ],
// 		});

// 	});

// 	keyDown("left", () => {
// 		player.move("left");
// 	});

// 	keyDown("right", () => {
// 		player.move("right");
// 	});

// 	player.click(() => {
// 		console.log("oh hi");
// 	});

// 	all("bullet", (b) => {

// 		b.collides("enemy", (e) => {

// 			destroy(e);
// 			destroy(b);

// 			add({
// 				sprite: "frog",
// 				pos: vec2(rand(-240, 240), 160),
// 				tags: [ "enemy", ],
// 			});

// 		});

// 		b.move("up");

// 		if (b.pos.y >= 240) {
// 			destroy(b);
// 		}

// 	});

});

scene("menu", () => {
	// menu screen stuff
});

