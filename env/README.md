# Intro to Kaboom

Welcome! Kaboom is a JavaScript library that helps you make games fast and fun :D

This is an intro tutorial that will cover the basic concepts and make a very simple [Chrome Dino](https://en.wikipedia.org/wiki/Dinosaur_Game) - ish game.

![game](learn/game.png)

(scroll to bottom to see / copy the full game code)

Let's start by initializing the context with the `kaboom()` function.

```js
kaboom()
```

This should give you a blank canvas with a nice checkerboard pattern like this

![empty](learn/empty.png)

Then let's add some stuff to screen, like an image.

```js
// load a default sprite "mark"
loadMark()

// add it to screen
add([
    sprite("mark"),
    pos(80, 40),
])
```

Go ahead and just paste this code and run it, you should see a yellow smily face on screen!

Before explaining what this does, let's try adding some more stuff to it and see what happens:

```js
// add it to screen
add([
    sprite("mark"),
    pos(80, 40),
    scale(3),
    area(),
])

// turns on inspect mode
debug.inspect = true
```

Kaboom uses a component system to describe our game objects (a game object is basically any item you see on screen, like the player character, a bullet, a rock).

![comps](learn/comps.png)

If you're having trouble understanding, consider this standard human bean:

![humanbean](learn/humanbean.png)

Human are also composed from a list of components, each component provides different functionalities, which is exactly what component means in Kaboom. `add()` is the function you use to assemble all the components into a game object in kaboom:

![assemble](learn/assemble.png)

In kaboom different components provides different functionalities (properties, methods), for example, if you add a `body()` component, which makes the user respond to gravity, it also provides methods like `jump()`. Try this code:

```js
add([
    sprite("mark"),
    pos(80, 40),
    scale(3),
    area(),
])
```

(todo)

Here's the full code of our game:

```js
const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom();

// load assets
loadSprite("bean", "sprites/bean.png");
loadSound("horse", "sounds/horse.mp3");

scene("game", () => {

	// define gravity
	gravity(2400);

	// add a game object to screen
	const player = add([
		// list of components
		sprite("bean"),
		pos(80, 40),
		area(),
		body(),
	]);

	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(2),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(0.45, 0.75, 1),
	]);

	// jump when user press space
	keyPress("space", () => {
		if (player.grounded()) {
			player.jump(JUMP_FORCE);
		}
	});

	function spawnTree() {

		// add tree obj
		add([
			rect(48, rand(32, 96)),
			area(),
			outline(2),
			pos(width(), height() - FLOOR_HEIGHT),
			origin("botleft"),
			color(0.95, 0.55, 1),
			"tree",
		]);

		// wait a random amount of time to spawn next tree
		wait(rand(0.5, 1.5), spawnTree);

	}

	// start spawning trees
	spawnTree();

	// define action for every game obj with tag "tree"
	action("tree", (tree) => {

		// all trees will move by 'SPEED' pixels per second every frame
		tree.move(-SPEED, 0);

		// if tree goes out of screen, we remove it to save performance
		if (tree.pos.x <= -tree.width) {
			destroy(tree);
		}

	});

	// lose if player collides with any game obj with tag "tree"
	player.collides("tree", () => {
		// go to "lose" scene and pass the score
		go("lose", score);
	});

	// keep track of score
	let score = 0;

	const scoreLabel = add([
		text(score, 24),
		pos(12, 12),
	]);

	// increment score every frame
	action(() => {
		score++;
		scoreLabel.text = score;
	});

});

scene("lose", (score) => {

	// display score
	add([
		text(score, 120),
		pos(center()),
		origin("center"),
	]);

	// go back to game with space is pressed
	keyPress("space", () => {
		go("game");
	});

});

go("game");
```
