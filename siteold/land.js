const www = require("./www");
const global = require("./global");
const t = www.tag;

const css = {
	"html": {
		"font-size": "calc(0.5vw + 12px)",
		"font-family": "Necto Mono",
	},
	"body": {
		"padding": "48px",
		"background": "var(--color-bg) url(/site/img/bg.svg) repeat",
		"animation": "scroll linear 5s infinite",
	},
	"a": {
		"color": "var(--color-fg)",
		"border-radius": "12px",
		"padding": "2px 4px",
		":hover": {
			"background": "var(--color-fg)",
			"color": "var(--color-bg)",
		},
	},
	"#fun": {
		"cursor": "pointer",
		":hover": {
			"animation": "fun linear 1s infinite",
		},
	},
	"#content": {
		"margin": "0 auto",
		"width": "calc(600px + 30vw)",
		"max-width": "100%",
	},
	"#logo": {
		"transform-origin": "top left",
		"height": "180px",
		"position": "relative",
		"z-index": "1000",
		"@media": {
			"(max-width: 960px)": {
				"height": "160px",
				"transform": "scale(0.8)",
			},
			"(max-width: 640px)": {
				"height": "100px",
				"transform": "scale(0.5)",
			},
		},
		"#ka": {
			"position": "absolute",
			"left": "-24px",
			"top": "32px",
			"animation": "kaboom 5s infinite",
			"animation-delay": "0.08s",
		},
		"#boom": {
			"position": "absolute",
			"animation": "kaboom 5s infinite",
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
			"pointer-events": "none",
		},
		"#outline": {
			"position": "absolute",
			"left": "-10px",
			"top": "112px",
			"pointer-events": "none",
		},
		"#circle": {
			"position": "absolute",
			"top": "158px",
			"left": "244px",
			"pointer-events": "none",
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
	"label[for='themeswitch']": {
		"position": "fixed",
		"right": "16px",
		"bottom": "16px",
	},
	"@keyframes": {
		"scroll": {
			"0%": {
				"background-position": "0px 0px",
			},
			"100%": {
				"background-position": "48px 48px",
			},
		},
		"kaboom": {
			"0%": {
				"transform": "scale(1)",
			},
			"5%": {
				"transform": "scale(1.1)",
			},
			"10%": {
				"transform": "scale(1)",
			},
		},
		"fun": {
			"0%": {
				"color": "blue",
			},
			"20%": {
				"color": "orange",
			},
			"40%": {
				"color": "yellow",
			},
			"60%": {
				"color": "green",
			},
			"80%": {
				"color": "cyan",
			},
			"100%": {
				"color": "blue",
			},
		},
	},
};

const page = t("html", {}, [
	t("head", {}, [
		...global.head,
		t("title", {}, "Kaboom"),
		t("style", {}, www.css(css)),
		t("link", { rel: "stylesheet", href: "/css/paraiso.css"}),
	]),
	t("body", {}, [
		t("div", { id: "content", }, [
			t("div", { id: "logo", }, [
				t("img", { id: "boom", src: "/site/img/boom.svg", }),
				t("img", { id: "ka", src: "/site/img/ka.svg", }),
			]),
			www.spacer(24),
			t("div", { id: "main", }, [
				t("div", {}, "Kaboom is a JavaScript\ngame programming library\nthat helps you make games\nfast and <span id=\"fun\">fun</span>."),
				www.spacer(48),
				t("div", {}, [
					"Check out the ",
					t("a", { href: "/doc", }, "docs"),
					", ",
					t("a", { href: "/demo", }, "demos"),
					", \n",
					t("a", { href: "/doc/intro.md", }, "tutorial"),
					", and ",
					t("a", { href: "/github", }, "github"),
					".",
				]),
				t("img", { id: "highlight", src: "/site/img/highlight.png", }),
				t("img", { id: "outline", src: "/site/img/outline.png", }),
				t("img", { id: "circle", src: "/site/img/circle.png", }),
			]),
		]),
		t("input", { id: "themeswitch", type: "checkbox", name: "themeswitch", style: "display: none" }, ""),
		t("label", { for: "themeswitch", class: "switch theme", }, [
			t("div", { class: "strip", }, [
				t("div", { class: "ball", }, []),
			]),
		]),
		t("script", { src: "/site/js/land.js" }, ""),
	]),
]);

module.exports = page;
