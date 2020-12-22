// guide page

const fs = require("fs");
const dofile = require("./dofile");
const www = dofile("./www");
const styles = dofile("./styles");
const t = www.tag;

const styles2 = {
	"#main": {
		"width": "720px",
		"margin": "64px auto",
	},
	"#logo": {
		"width": "240px",
	},
	".inline": {
		"padding": "0 6px",
		"border-radius": "6px",
		"border": "2px solid #ddd",
		"background": "#f7f7f7 !important",
	},
	".desc": {
		"font-size": "18px",
		"margin": "24px 0",
		"line-height": "1.5",
	},
	".code": {
		"display": "block",
		"padding": "0 12px",
		":first-of-type": {
			"padding-top": "12px",
		},
		":last-of-type": {
			"padding-bottom": "12px",
		},
		"&.hide": {
			"display": "none",
		},
		"&.add": {
			"padding": "6px 12px",
			"background": "#e0ffe0 !important",
		},
		"&.del": {
			"padding": "6px 12px",
			"background": "#ffe0e0 !important",
		},
	},
	"li": {
		"font-size": "18px",
		"margin-left": "32px",
	},
};

function c(pieces) {
	return t("pre", {}, [
		t("code", { class: "javascript", }, pieces),
	]);
}

function genblock(classes) {
	return (code) => {
		if (code[0] === "\n") {
			code = code.substring(1);
		}
		return t("span", { class: classes }, code);
	};
}

const n = genblock("code normal");
const a = genblock("code add");
const d = genblock("code del");

function p(text) {
	const pieces = text.split("`");
	const html = [];
	let isCode = false;
	for (const piece of pieces) {
		if (isCode) {
			html.push(t("span", { class: "inline", }, piece));
		} else {
			html.push(t("span", {}, piece));
		}
		isCode = !isCode;
	}
	return t("p", { class: "desc", }, html);
}

const guide = [
// -------------------------------------------------------------
p("Let's make a shooter game with kaboom.js!"),
p("first let's call the `init()` function to initialize our game:"),
// -------------------------------------------------------------
c([
a(`
init({
	width: 640,
	height: 480,
});
`),
]),
// -------------------------------------------------------------
p("this will help us create a 640x480 canvas for drawing the game view. Try running this piece of code! Wild 640x480 canvas appears!"),
p("then let's load our resources!"),
// -------------------------------------------------------------
c([
n(`
init({
	width: 640,
	height: 480,
});

`),
a(`
loadSprite("guy", "guy.png");
`),
]),
// -------------------------------------------------------------
p("this will load the image file \"guy.png\" into the asset manager, with the name \"guy\""),
p("Let's put this image into our game as a character! To do this we are going to create a new scene, called \"main\""),
// -------------------------------------------------------------
c([
n(`
init({
	width: 640,
	height: 480,
});

loadSprite("guy", "guy.png");

`),
a(`
ready(() => {

	scene("main");

	// put stuff in "main" scene here

	start();

});
`),
]),
// -------------------------------------------------------------
p("`ready()` makes sure the callback gets called after all the resources are loaded, so we can have all the asset information we need when we're building our scene, e.g. sprite sizes, animation data etc. we don't really need them now but it's good to wrap everything inside in case of weird asset related bugs."),
p("Any code below this `scene()` call will be describing what we're going to put into this scene and how stuff works, until another `scene()` call, or a `start()` call to end the scene building step and start the game"),
p("Let's add the player sprite to the scene:"),
// -------------------------------------------------------------
c([
n(`
scene("main");
`),
a(`
const player = sprite("guy", {
	pos: vec2(0, 0),
});
`),
n(`
start();
`),
]),
// -------------------------------------------------------------
p("the function `sprite(name)` adds a sprite with specified name to the scene, returning the reference to the game object. A game object is the basic unit in Kaboom.js, it contains all the information we needed to put stuff on screen and how they works, more will be explained later. Try run the game now! There'll now be a player in the middle of the screen!"),
p("note that when you call `sprite()`, the game object is not added to the scene yet, everything gets added to scene when `start()` gets called, we're only describing what objects to add to scene in the scene description process, so that we can easily manage which scenes contain which objects"),
p("now let's make the player move around with our keys!"),
// -------------------------------------------------------------
c([
n(`
scene("main");

const player = sprite("guy", {
	pos: vec2(0, 0),
});
`),
a(`
const speed = 320;

keyDown("left", () => {
	player.move(vec2(-speed, 0));
});

keyDown("right", () => {
	player.move(vec2(speed, 0));
});

keyDown("up", () => {
	player.move(vec2(0, speed));
});

keyDown("down", () => {
	player.move(vec2(0, -speed));
});
`),
n(`
start();
`),
]),
// -------------------------------------------------------------
p("`keyDown()` will register a key down event, so every frame user is holding the specified key down, the callback would run. `player.move()` does exactly what it says, it moves the player. Try running the game now, the player will move when you hold down arrow keys"),
p("you might have noticed something now... our player is weak! yeah sure he can move around and all, might be a swift fella, a burglar of the night, good at dodging and sneaking, but a decent shooter game should feature a player character that's capable of shooting stuff, inflicting bullet wounds upon enemies, causing explosions! Let's make the player shoot a bullet out everytime they pushed the space button"),
// -------------------------------------------------------------
c([
n(`
scene("main");

const player = sprite("guy", {
	pos: vec2(0, 0),
});
const speed = 320;
`),
a(`
const bulletSpeed = 960;

keyPress(" ", () => {
	rect(5, 5, {
		pos: player.pos,
		tags: [ "bullet", ],
	});
});

sup("bullet", (b) => {
	b.move(vec2(bulletSpeed, 0));
});
`),
]),
// -------------------------------------------------------------
p("ok a lot to explain here. `keyPress()` register a key press event which is different from the `keyDown()` above, `keyPress` would run only once when the player presses the key, while `keyDown` runs every frame when the player is holding down the keys, so `keyPress` is good for one shot events like firing bullets."),
p("`rect()` is similar to `sprite()`, it creates a rectangle and adds to the game scene. We give it a 'bullet' tag so we can easily define behavior of a specific tag group, see functions `hi()`, `bye()`, `sup()` and `ouch()`"),
p("`sup(\"bullet\", ..)` is like asking, 'what's up! every object with tag \"bullet\"?' every frame, and they're supposed to respond what they're doing at the moment (the behavior every frame, in this case it's moving `vec2(bulletSpeed, 0)`)"),
p("if you run the game now, there'll be a bullet shooting out of the player's stomach everytime you press space, but yeah you might have noticed again, this bullet, is clearly not threatening enough.. it's *white* and *fixed sized*, which is the worse thing that can happen to a bullet, we need to change that!"),
// -------------------------------------------------------------
c([
n(`
sup("bullet", (b) => {
	b.move(vec2(bulletSpeed, 0));
`),
a(`
	b.color = rand(color(0, 0, 0), color(1, 1, 1)),,
	b.width = rand(4, 8);
	b.height = rand(4, 8);
`),
n(`
});
`),
]),
// -------------------------------------------------------------
p("here, we added variants to the bullets' appearance so it looks more threatening"),
p("let's add the enemies! normally enemies might have fancy AI to make them look natural, but that's lame, there's too much logic in the world already, let's just make it easy and just and make them spawn every 1s and follow the player relentlessly"),
// -------------------------------------------------------------
c([
a(`
const enemySpeed = 80;

function addEnemy() {
	sprite("guy", {
		// random position on screen
		pos: rand(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
		tags: [ "enemy", ],
		color: color(0, 0, 1),
		speed: 48,
	});
}

loop(1, () => {
	addEnemy();
});
`),
]),
// -------------------------------------------------------------
p("here we created a function `addEnemy()` that helps us create a new sprite and add it to the world, give them a tag \"enemy\" for describing their behavior later, and give them a `color(0, 0, 1)` cuz bad guys are all blue. Use `loop(t)` to make them appear every `t` second. Now the enemy behavior:"),
// -------------------------------------------------------------
c([
a(`
sup("enemy", (e) => {
	// direction vector between player and enemy
	const dir = player.pos.sub(e.pos).unit();
	// move towards the player
	e.move(dir.scale(enemySpeed));
});

ouch("enemy", "bullet", (e, b) => {
	destroy(e);
	destroy(b);
});

// jump to "die" scene after player touches enemy
player.ouch("enemy", (e) => {
	go("start");
});
`)
]),
// -------------------------------------------------------------
p("`sup()`, like above, describes the behavior of objects with tag \"enemy\" every frame. Here we want our enemies to constantly move towards the player, so we calculate the directional vector between the enemy and the player, then move towards it. `sub()`, `unit()`, `add()`, and `scale()` are all methods under `vec2`. They're not that readable cuz JavaScrit doesn't have operator overloading"),
p("`ouch()` is similar to `sup()`, it describes the behavior when certain object collides, in this case we want enemy to die when they're hit by objects with tag \"bullet\", so `destroy()` them in the callback. You can also define all these event methods on a single game object too, in this case we defined it for `player` and call `go(\"start\")`, which goes to the \"start\" scene when an enemy touches the player. We don't have the \"start\" scene yet, let's define it now!"),
// -------------------------------------------------------------
c([
n(`
// jump to "die" scene after player touches enemy
player.ouch("enemy", (e) => {
	go("start");
});

`),
a(`
scene("start");

text("press space to start!", {
	size: 16,
});

keyPress(" ", () => {
	reload("main");
	go("main");
});
`),
d(`
start("main");
`),
a(`
start("start");
`),
]),
// -------------------------------------------------------------
p("we add another `scene()` call after we're done with the \"main\" scene, add a simple text and a space key trigger to reload and go to the game scene again. `reload()` does what it says and reinitialize everything in the specified scene, return all the object states to the initial states described."),
p("Awesome! Now we have a basic game loop and some basic gameplay. Full code:"),
// -------------------------------------------------------------
c([
n(`
init({
    width: 640,
    height: 480,
});

loadSprite("guy", "guy.png");

ready(() => {

	scene("main");

	const player = sprite("guy", {
		pos: vec2(0, 0),
	});
	// put stuff in "main" scene here

	const speed = 320;

	keyDown("left", () => {
		player.move(vec2(-speed, 0));
	});

	keyDown("right", () => {
		player.move(vec2(speed, 0));
	});

	keyDown("up", () => {
		player.move(vec2(0, speed));
	});

	keyDown("down", () => {
		player.move(vec2(0, -speed));
	});

	const bulletSpeed = 960;

	keyPress(" ", () => {
		rect(5, 5, {
			pos: player.pos,
			tags: [ "bullet", ],
		});
	});

	sup("bullet", (b) => {
		b.move(vec2(bulletSpeed, 0));
		b.color = rand(color(0, 0, 0), color(1, 1, 1)),
		b.width = rand(4, 8);
		b.height = rand(4, 8);
	});

	const enemySpeed = 80;

	function addEnemy() {
		sprite("guy", {
			// random position on screen
			pos: rand(vec2(-width() / 2, -height() / 2), vec2(width() / 2, height() / 2)),
			tags: [ "enemy", ],
			color: color(0, 0, 1),
			speed: 48,
		});
	}

	loop(1, () => {
		addEnemy();
	});

	sup("enemy", (e) => {
		// direction vector between player and enemy
		const dir = player.pos.sub(e.pos).unit();
		// move towards the player
		e.move(dir.scale(enemySpeed));
	});

	ouch("enemy", "bullet", (e, b) => {
		destroy(e);
		destroy(b);
	});

	// jump to "die" scene after player touches enemy
	player.ouch("enemy", (e) => {
		go("start");
	});

	scene("start");

	text("press space to start!", {
		size: 16,
	});

	keyPress(" ", () => {
		reload("main");
		go("main");
	});

	start("start");

});
`),
]),
// -------------------------------------------------------------
p("Now, I challenge you to:"),
t("li", {}, "make the player shoot bullet at the direction they're facing!"),
t("li", {}, "make enemies spawn far away from player, so there won't be instant death!"),
t("li", {}, "use your own assets!"),
t("li", {}, "add visual and audio feedbacks to make the game more responsive!"),
t("li", {}, "add powerups!"),
t("li", {}, "add more enemy types!"),
];

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "KaBoom.js: Let's Make a Shooter Game!"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.style(styles)),
		t("style", {}, www.style(styles2)),
		t("style", {}, fs.readFileSync(`${__dirname}/lib/highlight.css`, "utf-8")),
		t("script", {}, fs.readFileSync(`${__dirname}/lib/highlight.js`, "utf-8")),
		t("script", {}, "hljs.initHighlightingOnLoad();"),
		t("script", {}, "hljs.configure({tabReplace: \"    \"});"),
	]),
	t("body", {}, [
		t("div", { id: "main", }, [
			t("img", { id: "logo", src: "data:image/png;base64," + fs.readFileSync(`${__dirname}/res/kaboom.png`, "base64") }),
			...guide,
		]),
	]),
]);

module.exports = "<!DOCTYPE html>" + page;

