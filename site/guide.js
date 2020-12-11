// guide page

const fs = require("fs");
const dofile = require("./dofile");
const www = dofile("./www");
const styles = dofile("./styles");
const t = www.tag;

const styles2 = {
	"#main": {
		"width": "50%",
		"margin": "64px auto",
	},
	"code": {
		"font-size": "16px",
		"padding": "0 !important",
		"margin": "24px 0px",
		"border-radius": "6px",
		"border": "2px solid #ddd",
		"background": "#f7f7f7 !important",
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
		"padding": "6px 12px",
		"&.add": {
			"background": "#e0ffe0 !important",
		},
		"&.del": {
			"background": "#ffe0e0 !important",
		},
	},
};

function code(pieces) {
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

const n = genblock("code");
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

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "Let's Make a Shooter Game!"),
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
			p("Let's make a shooter game!"),
			p("first let's call the `init()` function to initialize our game:"),
			code([
a(`
init({
	width: 640,
	height: 480,
});
`),
			]),
			p("this will help us create a 640x480 canvas for drawing the game view. Try running this piece of code! Wild 640x480 canvas appears!"),
			p("then let's load our resources!"),
			code([
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
			p("this will load the image file \"guy.png\" into the asset manager, with the name \"guy\""),
			p("Let's put this image into our game as a character! To do this we are going to create a new scene, called \"main\""),
			code([
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
			p("any code below this `scene()` call will be describing what we're going to put into this scene, until another `scene()` call, or a `start()` call to end the scene building and start the game"),
			p("Let's add the player sprite to the scene:"),
			code([
n(`
init({
	width: 640,
	height: 480,
});

loadSprite("guy", "guy.png");

scene("main");
`),
a(`
const player = sprite("guy");
`),
n(`
start();
`),
			]),
			p("the function `sprite(name)` adds a sprite with specified name to the scene, returning the reference to the game object. Try run the game now! There'll now be a player in the middle of the screen!"),
			p("now let's make the player move around with our keys!"),
			code([
n(`
init({
	width: 640,
	height: 480,
});

loadSprite("guy", "guy.png");

scene("main");
const player = sprite("guy");
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
			p("`keyDown()` will register a keyDown event, so every frame user is holding the specified key down, the callback would run. `player.move()` does exactly what it says, it moves the player. Try running the game now, the player will move when you hold down arrow keys"),
		]),
	]),
]);

module.exports = "<!DOCTYPE html>" + page;

