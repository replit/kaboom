const www = require("./www");
const t = www.tag;

const css = {
	":root": {
		"--color-bg": "#ffffff",
		"--color-bg2": "#f8f8f8",
		"--color-bg3": "#eaeaea",
		"--color-outline": "#eaeaea",
		"--color-fg": "#333333",
		"--color-fg2": "#666666",
		"--color-fg3": "#999999",
		"--color-fg4": "#cccccc",
		"--color-highlight": "#0080ff",
		"--color-title-bg": "#fff8bc",
	},
	"[data-theme='dark']": {
		"--color-bg": "#111117",
		"--color-bg2": "#15151f",
		"--color-bg3": "#21212f",
		"--color-outline": "#25252f",
		"--color-fg": "#dadada",
		"--color-fg2": "#aaaaaa",
		"--color-fg3": "#7a7a7a",
		"--color-fg4": "#4a4a4a",
		"--color-highlight": "#1090ef",
		"--color-title-bg": "#132131",
	},
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
	},
	"body": {
		"width": "100%",
		"height": "100%",
		"background": "var(--color-bg)",
	},
	"pre": {
		"overflow": "scroll",
		"font-family": "IBM Plex Mono",
		"background": "var(--color-bg2)",
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
		"background": "var(--color-bg3)",
		"font-size": "90%",
		"padding": "4px 8px",
		"border-radius": "8px",
		"font-family": "IBM Plex Mono",
	},
	"blockquote": {
		"color": "var(--color-fg3)",
		"padding-left": "24px",
		"border-left": "solid 2px var(--color-fg4)",
	},
	"img": {
		"display": "block",
	},
	"a": {
		"color": "var(--color-highlight)",
	},
	"ul": {
		"margin-left": "32px",
		...www.vspace(8),
	},
	"ol": {
		"margin-left": "32px",
		...www.vspace(8),
	},
	"button": {
		"background": "var(--color-bg3)",
		"color": "var(--color-fg)",
		"padding": "4px 8px",
		"border": "solid 2px var(--color-outline)",
		"border-radius": "8px",
		"font-size": "16px",
		"cursor": "pointer",
		":hover": {
			"background": "var(--color-outline)",
		},
	},
	"select": {
		"padding": "4px 8px",
		"font-size": "16px",
		"border-radius": "8px",
		"border": "solid 2px var(--color-outline)",
		"background": "var(--color-bg3)",
		"color": "var(--color-fg)",
		":focus": {
			"outline": "none",
		},
	},
	".switch": {
		".strip": {
			"width": "56px",
			"height": "32px",
			"border-radius": "64px",
			"cursor": "pointer",
			"background": "var(--color-bg3)",
			"position": "relative",
			".ball": {
				"border": "solid 4px var(--color-bg3)",
				"background": "var(--color-bg) no-repeat 50% 50%",
				"background-size": "60% 60%",
				"width": "32px",
				"height": "32px",
				"border-radius": "50%",
				"position": "absolute",
				"left": "0",
			},
		},
		"&.theme": {
			".strip": {
				".ball": {
					"background-image": "url(/site/img/sun.svg)",
				},
			},
		},
		"&.on": {
			".strip": {
				"background": "var(--color-highlight)",
				".ball": {
					"left": "24px",
					"border": "solid 4px var(--color-highlight)",
				},
			},
		},
		"&.theme.on": {
			".strip": {
				"background": "var(--color-bg3)",
				".ball": {
					"left": "24px",
					"background-image": "url(/site/img/moon.svg)",
					"border": "solid 4px var(--color-bg3)",
				},
			},
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
