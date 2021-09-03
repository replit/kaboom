// Egg minigames (yes, like Peppa)

kaboom();

loadSprite("bean", "sprites/bean2.png", {
	sliceX: 4,
	anims: {
		idle: {
			from: 0,
			to: 0,
		},
		put: {
			from: 3,
			to: 3,
		},
	},
});

loadSprite("newbean", "sprites/bean.png");
loadSprite("egg", "sprites/egg.png");
loadSprite("egg_crack", "sprites/egg_crack.png");

const player = add([
	sprite("bean"),
	pos(center()),
	scale(2),
	origin("center"),
	z(50),
]);

const counter = add([
	text("0"),
	pos(24, 24),
	z(100),
	{ value: 0 },
]);

// "shake" is taken, so..
function rock() {
	let strength = 0;
	let time = 0;
	return {
		id: "rock",
		require: [ "rotate" ],
		update() {
			if (strength === 0) {
				return;
			}
			this.angle = Math.sin(time * 10) * strength;
			time += dt();
			strength -= dt() * 30;
			if (strength <= 0) {
				strength = 0;
				time = 0;
			}
		},
		rock(n = 15) {
			strength = n;
		},
	};
}

keyPress("space", () => {

	player.moveTo(rand(0, width()), rand(0, height()));

	add([
		sprite("egg"),
		pos(player.pos.x + rand(-10, 10), player.pos.y + rand(-10, 10)),
		scale(1),
		rotate(0),
		origin("bot"),
		rock(),
		"egg",
		{ stage: 0 },
	]);

	counter.value += 1;
	counter.text = counter.value;

	player.play("put");
	wait(0.2, () => player.play("idle"));

});

// HATCH
keyPress("enter", () => {
	every("egg", (e) => {
		if (e.stage === 0) {
			e.stage = 1;
			e.rock();
			e.use(sprite("egg_crack"));
		} else if (e.stage === 1) {
			e.stage = 2;
			e.use(sprite("newbean"));
			addKaboom(e.pos.sub(0, e.height / 2));
		}
	});
});
