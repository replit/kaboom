const www = require("./www");
const gstyle = require("./gstyle");
const t = www.tag;

const css = {
	"html": {
		"font-size": "calc(0.5vw + 12px)",
	},
	"body": {
		"background": `url("/img/bg.svg") repeat`,
		"padding": "48px",
		"animation": "scroll linear 5s infinite",
	},
	"a": {
		"color": "#333333",
		"border-radius": "12px",
		"padding": "2px 4px",
		":hover": {
			"background": "#333333",
			"color": "white",
		},
	},
	"#content": {
		"margin": "0 auto",
		"width": "calc(600px + 30vw)",
		"max-width": "100%",
	},
	"#logo": {
		"width": "200px",
		"transform-origin": "top left",
		"@media": {
			"(max-width: 960px)": {
				"transform": "scale(0.8)",
			},
			"(max-width: 640px)": {
				"transform": "scale(0.5)",
			},
		},
	},
	"#main": {
		"position": "relative",
		"font-size": "48px",
		"white-space": "pre",
		"transform-origin": "top left",
		"#highlight": {
			"position": "absolute",
			"left": "-10px",
			"top": "-3px",
		},
		"#outline": {
			"position": "absolute",
			"left": "-10px",
			"top": "112px",
		},
		"#circle": {
			"position": "absolute",
			"top": "158px",
			"left": "244px",
		},
		"@media": {
			"(max-width: 960px)": {
				"transform": "scale(0.8)",
			},
			"(max-width: 640px)": {
				"transform": "scale(0.5)",
			},
		},
	},
	"@keyframes": {
		"scroll": {
			"0%": {
				"background-position": "0px 0px",
			},
			"100%": {
				"background-position": "48px 48px",
			},
		}
	},
};

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "Kaboom"),
		t("style", {}, www.css(gstyle)),
		t("style", {}, www.css(css)),
		t("link", { rel: "icon", href: "/img/kaboom.png"}),
		t("link", { rel: "stylesheet", href: "/css/paraiso.css"}),
	]),
	t("body", {}, [
		t("div", { id: "content", }, [
			t("img", { id: "logo", src: "/img/kaboom.png", }),
			www.spacer(24),
			t("div", { id: "main", }, [
				t("div", {}, "Kaboom is a JavaScript\ngame programming library\nthat helps you make games\nfast and fun."),
				www.spacer(48),
				t("div", {}, [
					"Check out the ",
					t("a", { href: "/doc", }, "docs"),
					", ",
					t("a", { href: "/demo", }, "demos"),
					", \nand ",
					t("a", { href: "/tut/intro.md", }, "tutorial"),
					".",
				]),
				t("img", { id: "highlight", src: "/img/highlight.png", }),
				t("img", { id: "outline", src: "/img/outline.png", }),
				t("img", { id: "circle", src: "/img/circle.png", }),
			]),
		]),
	]),
]);

module.exports = page;
