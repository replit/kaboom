const www = require("./www");
const t = www.tag;

const css = {
	"@font-face": [
		{
			"font-family": "IBM Plex Sans",
			"src": `url("/site/fonts/IBMPlexSans-Regular.ttf") format("truetype")`,
		},
		{
			"font-family": "IBM Plex Mono",
			"src": `url("/site/fonts/IBMPlexMono-Regular.ttf") format("truetype")`,
		},
		{
			"font-family": "Necto Mono",
			"src": `url("/site/fonts/NectoMono-Regular.otf") format("opentype")`,
		},
	],
	"*": {
		"padding": "0",
		"margin": "0",
		"box-sizing": "border-box",
		"font-family": "inherit",
	},
	"html": {
		"width": "100%",
		"height": "100%",
		"font-family": "IBM Plex Sans",
		"color": "var(--color-fg)",
		"--color-bg": "#ffffff",
		"--color-bg2": "#f5f5f5",
		"--color-bg3": "#efefef",
		"--color-code-bg": "#fafafa",
		"--color-outline": "#eaeaea",
		"--color-fg": "#333333",
		"--color-fg2": "#666666",
		"--color-fg3": "#999999",
		"--color-highlight": "#0080ff",
		"--color-title-bg": "#fff8bc",
	},
	"html[data-theme='dark']": {
		"--color-bg": "#111117",
		"--color-bg2": "#15151f",
		"--color-bg3": "#212127",
		"--color-code-bg": "#15151f",
		"--color-outline": "#25252f",
		"--color-fg": "#dadada",
		"--color-fg2": "#aaaaaa",
		"--color-fg3": "#7a7a7a",
		"--color-highlight": "#0080ff",
		"--color-title-bg": "#132131",
	},
	"body": {
		"width": "100%",
		"height": "100%",
		"background": "var(--color-bg)",
	},
	"pre": {
		"overflow": "scroll",
		"font-family": "IBM Plex Mono",
		"background": "var(--color-code-bg)",
		"padding": "16px",
		"border": "solid 2px var(--color-outline)",
		"border-radius": "12px",
		"tab-size": "4",
		"> code": {
			"background": "none",
			"border": "none",
			"padding": "none",
			"font-size": "inherit",
		},
	},
	"code": {
		"background": "var(--color-code-bg)",
		"border": "solid 2px #eaeaea",
		"font-size": "90%",
		"padding": "2px 6px",
		"border-radius": "12px",
		"font-family": "IBM Plex Mono",
	},
	"blockquote": {
		"color": "#999999",
		"padding-left": "24px",
		"border-left": "solid 3px #cccccc",
	},
	"img": {
		"display": "block",
	},
	"button": {
		"background": "var(--color-bg)",
		"color": "var(--color-fg)",
		"padding": "6px 12px",
		"border": "solid 1px var(--color-outline)",
		"border-radius": "8px",
		"font-size": "16px",
		"cursor": "pointer",
		":active": {
			"background": "var(--color-outline)",
		},
	},
	"select": {
		"padding": "6px 12px",
		"font-size": "16px",
		"border-radius": "8px",
		"border": "solid 1px var(--color-outline)",
		"background": "var(--color-bg)",
		"color": "var(--color-fg)",
		":focus": {
			"outline": "none",
		},
	},
};

const head = [
	t("meta", { charset: "utf-8", }),
	t("style", {}, www.css(css)),
	t("link", { rel: "icon", href: "/site/img/k.png"}),
];

module.exports = {
	head,
	css,
};
