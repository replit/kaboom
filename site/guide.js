// guide page

const dofile = require("./dofile");
const www = dofile("./www");
const gstyle = dofile("./gstyle");
const t = www.tag;

const style = {
	"*": {
		"margin": "0",
		"padding": "0",
		"font-family": "Consolas, Monospace, Courier",
		"box-sizing": "border-box",
	},
	"html": {
		"width": "100%",
	},
	"body": {
		"width": "100%",
	},
	".content": {
		"margin": "64px auto",
		"width": "640px",
		"> *": {
			"margin-bottom": "32px",
		},
	},
	".desc": {
		"font-size": "20px",
		"color": "#333333",
	},
	".example": {
		"display": "flex",
		"flex-direction": "column",
	},
	".editor": {
		"width": "100%",
	},
	".CodeMirror": {
		"width": "100%",
		"height": "100% !important",
		"border-top-left-radius": "8px",
		"border-top-right-radius": "8px",
	},
	".runbtn": {
		"border-radius": "8px",
		"background": "#dddddd",
		"font-size": "20px",
		"color": "#333333",
		"border": "solid 2px #bbbbbb",
		"padding": "0 8px",
		"margin-bottom": "12px",
		"&:active": {
			"background": "#cccccc",
		},
		"&:focus": {
			"outline": "none",
		},
	},
	".gameview": {
		"width": "640px",
		"height": "640px",
		"background": "black",
		"border": "none",
		"border-bottom-left-radius": "8px",
		"border-bottom-right-radius": "8px",
	},
};

function example(code) {
	return t("div", {}, [
		t("button", { class: "runbtn", }, "run"),
		t("div", { class: "example", }, [
			t("textarea", { class: "editor", }, code.trim()),
		]),
	]);
}

const guide = [
	t("p", {}, "Let's learn kaboom!"),
	example(`
add([
	text("ohhimark"),
	pos(100, 100),
]);
	`),
	t("p", {}, "make stuff move"),
	example(`
	`),
];

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "KaBoom!!!"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.style(style)),
		t("link", { rel: "stylesheet", href: "/pub/lib/codemirror/codemirror.css", }),
		t("link", { rel: "stylesheet", href: "/pub/lib/codemirror/themes/dracula.css", }),
		t("script", { src: "/pub/lib/codemirror/codemirror.js", }, ""),
		t("script", { src: "/pub/lib/codemirror/modes/javascript.js", }, ""),
	]),
	t("body", {}, [
		t("div", { class: "content", }, guide),
		t("script", { src: "/pub/js/guide.js", }, ""),
	]),
]);

module.exports = "<!DOCTYPE html>" + page;

