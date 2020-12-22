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
scene("main");

// put stuff in "main" scene here

start();
`),
]),
// -------------------------------------------------------------
p("any code below this `scene()` call will be describing what we're going to put into this scene, until another `scene()` call, or a `start()` call to end the scene building and start the game"),
p("Let's add the player sprite to the scene:"),
// -------------------------------------------------------------
c([
n(`
init({
	width: 640,
	height: 480,
});

loadSprite("guy", "guy.png");

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
p("the function `sprite(name)` adds a sprite with specified name to the scene, returning the reference to the game object. Try run the game now! There'll now be a player in the middle of the screen!"),
p("now let's make the player move around with our keys!"),
// -------------------------------------------------------------
c([
n(`
init({
	width: 640,
	height: 480,
});

loadSprite("guy", "guy.png");

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

keyDown("right", () => {
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
init({
	width: 640,
	height: 480,
});

loadSprite("guy", "guy.png");

scene("main");

const player = sprite("guy", {
	pos: vec2(0, 0),
});
const speed = 320;
`),
a(`
const bulletSpeed = 960;

keyPress("space", () => {
	rect(5, 5, {
		pos: player.pos,
		tags: [ "bullet", ],
	});
});

sup("bullet", (b) => {
	b.move(vec2(bulletSpeed, 0));
});
`),
n(`

keyDown("left", () => {
	player.move(vec2(-speed, 0));
});

keyDown("right", () => {
	player.move(vec2(speed, 0));
});

keyDown("up", () => {
	player.move(vec2(0, speed));
});

keyDown("right", () => {
	player.move(vec2(0, -speed));
});

start();
`),
]),
// -------------------------------------------------------------
p("ok a lot to explain here. `keyPress()` register a key press event which is different from the `keyDown()` above, `keyPress` would run only once when the player presses the key, while `keyDown` runs every frame when the player is holding down the keys, so `keyPress` is good for one shot events like firing bullets."),
p("`rect()` is similar to `sprite()`, it creates a rectangle and adds to the game scene"),
p("`sup()` is asking the bullet, 'sup bullet?', and they're supposed to respond what they're doing at the moment (the behavior every frame, in this case it's moving `vec2(bulletSoeed, 0))`"),
p("if you run the game now, there'll be a bullet shooting out of the player's stomach everytime you press space, but yeah you might have noticed again, this bullet thing, is clearly not threatening enough.. it's *WHITE* and *FIXED SIZED*, which is the worse thing that can happen to a bullet, we just need to change that before this game becomes a complete bore"),
// -------------------------------------------------------------
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

