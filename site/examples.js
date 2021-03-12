// examples page

const fs = require("fs");
const path = require("path");
const dofile = require("./dofile");
const www = dofile("./www");
const gstyle = dofile("./gstyle");
const t = www.tag;

const style = {
	"*": {
		"margin": "0",
		"padding": "0",
		"font-family": "Monospace",
		"box-sizing": "border-box",
	},
	"html": {
		"width": "100%",
		"height": "100%",
	},
	"body": {
		"width": "100%",
		"height": "100%",
		"overflow": "hidden",
	},
	"label": {
		"user-select": "none",
	},
	"#head": {
		"width": "100%",
		"height": "48px",
		"background": "rgb(30, 32, 44)",
		"color": "white",
		"display": "flex",
		"justify-content": "space-between",
		"align-items": "center",
		"overflow": "hidden",
		"padding": "0 12px",
	},
	".subhead": {
		"height": "100%",
		"display": "flex",
		"align-items": "center",
		":first-child": {
			"> *": {
				"margin-right": "12px",
			}
		},
		":last-child": {
			"> *": {
				"margin-left": "12px",
			}
		},
	},
	"input[type=checkbox]": {
		"width": "16px",
		"height": "16px",
	},
	"select": {
		"font-size": "20px",
		"border-radius": "4px",
		"border": "none",
		"background": "#ffffff",
		"padding": "0 8px",
		"&:focus": {
			"outline": "none",
		},
	},
	"button": {
		"padding": "0 8px",
		"border": "none",
		"background": "#ffffff",
		"border-radius": "4px",
		"font-size": "20px",
		"&:hover": {
			"cursor": "pointer",
		},
		"&:focus": {
			"outline": "none",
		},
		"&:active": {
			"background": "#cccccc",
		},
	},
	"#logo": {
		"width": "auto",
		"height": "160%",
		"> img": {
			"width": "auto",
			"height": "100%",
		},
	},
	"#box": {
		"width": "100%",
		"height": "calc(100% - 48px)",
		"display": "flex",
	},
	"#editor": {
		"width": "50%",
		"height": "100%",
		"font-size": "20px",
		"> *": {
			"width": "100%",
			"height": "100%",
		},
	},
	"#gameview": {
		"width": "50%",
		"height": "100%",
		"border": "none",
		"background": "black",
	},
};

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "KaBoom Examples"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.style(style)),
		t("link", { rel: "stylesheet", href: "/pub/lib/codemirror/codemirror.css", }),
		t("link", { rel: "stylesheet", href: "/pub/lib/codemirror/themes/dracula.css", }),
		t("script", { src: "/pub/lib/codemirror/codemirror.js", }, ""),
		t("script", { src: "/pub/lib/codemirror/modes/javascript.js", }, ""),
	]),
	t("body", {}, [
		t("div", { id: "head", }, [
			t("div", { class: "subhead", }, [
				t("a", { href: "/", id: "logo", }, [
					t("img", { src: "/pub/img/kaboom.svg", }),
				]),
				t("select", {
					id: "select",
					name: "example",
					value: "hi",
					onchange: "update()",
				}, fs.readdirSync("./pub/examples").map((file) => {
					return t("option", { selected: file === "hi.js" }, path.basename(file, ".js"));
				})),
				t("button", { onclick: "run()", }, "run"),
			]),
			t("div", { class: "subhead", }, [
				t("label", { for: "liveupdate", }, "live update"),
				t("input", { id: "liveupdate", name: "liveupdate", type: "checkbox", }),
			]),
		]),
		t("div", { id: "box", }, [
			t("div", { id: "editor", }, []),
			t("iframe", { id: "gameview", }, []),
		]),
		t("script", { src: "/pub/js/examples.js", type: "module", }, ""),
	]),
]);

module.exports = "<!DOCTYPE html>" + page;

