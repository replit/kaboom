// mian page

const dofile = require("./dofile");
const www = require("./www");
const api = dofile("./api");
const gstyle = dofile("./gstyle");
const t = www.tag;

const style = {

	"body": {
		"background": "#0080ff",
	},

	"#game-view": {
		"width": "100%",
		"height": "100%",
		"position": "fixed",
		"top": "0",
		"left": "0",
		"z-index": "-100",
		"border": "none",
	},

	"#editor-view": {

		"width": "100%",
		"height": "50%",
		"position": "fixed",
		"bottom": "0",
		"left": "0",
		"z-index": "100",
		"background": "white",

		"#editor": {
			"width": "100%",
			"height": "100%",
		},

	},

	"#main": {

		"width": "calc(50% + 320px)",
		"margin": "64px auto",
		"display": "flex",
		"justify-content": "space-between",
		"align-items": "flex-start",

		"@media": {
			"screen and (max-width: 640px)": {
				"width": "90%",
				"flex-direction": "column",
			},
		},

	},

	"#chill": {
		"width": "100%",
		"border-radius": "9px",
	},

	"code": {
		// TODO: why it has so much space above
		"margin-top": "-12px",
		"padding": "6px !important",
	},

	".panel": {
		"padding": "24px",
		"background": "#ffffff",
		"border": "solid 3px #000000",
		"margin-bottom": "32px",
		"border-radius": "24px",
	},

	"#sidebar": {

		"width": "232px",

		"@media": {
			"screen and (max-width: 640px)": {
				"width": "100%",
			},
		},

		"#logo": {
			"width": "100%",
			"display": "flex",
			"height": "108px",
			"margin-bottom": "12px",
			"position": "relative",
			":hover": {
				"cursor": "pointer",
				"#ka": {
					"transform": "scale(1.1) rotate(0)",
				},
				"#boom": {
					"transform": "scale(1.05) rotate(-3deg)",
				},
			},
			"img": {
				"width": "100%",
				"transition": "0.5s",
				"position": "absolute",
			},
		},

		".section": {

			".title": {
				"font-size": "18px",
				"font-weight": "bold",
				"margin-top": "16px",
				"margin-bottom": "6px",
			},

		},

		".link": {

			"font-size": "16px",
			"display": "table",
			"color": "#0080ff",
			"text-decoration": "none",
			"border-radius": "6px",
			"padding": "2px 6px",

			":hover": {
				"background": "#0080ff",
				"color": "#ffffff !important",
				"cursor": "pointer",
			},

			":visited": {
				"color": "#0080ff",
			},

		},

	},

	"#content": {

		"width": "calc(100% - 232px - 16px)",

		"@media": {
			"screen and (max-width: 640px)": {
				"width": "100%",
			},
		},

		"#about": {
			"font-size": "24px",
			"margin-bottom": "24px",
		},

		".title": {
			"font-size": "24px",
			"margin-bottom": "12px",
			"font-weight": "bold",
			"background": "#ffffa0",
			"padding": "2px 9px",
			"border-radius": "6px",
			"display": "table",
			"margin-left": "-6px",
			"margin-top": "32px",
		},

		".desc": {
			"font-size": "20px",
			"margin-bottom": "12px",
			"color": "#666666",
		},

		".entry": {

			".name": {
				"font-size": "24px",
				"display": "block",
				"margin-bottom": "6px",
			},

			".desc": {
				"font-size": "18px",
				"margin-bottom": "24px",
			},

		},

	},

};

function code(c, lang) {
	return t("pre", {}, [
		t("code", { class: lang || "javascript", }, www.escapeHTML(c.trim())),
	]);
}

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "KaBoom!!!"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.style(gstyle)),
		t("style", {}, www.style(style)),
		t("link", { rel: "stylesheet", href: "/pub/lib/highlight.css", }),
		t("script", { src: "/pub/lib/highlight.js", }, ""),
		t("script", {}, "hljs.highlightAll();"),
		t("script", {}, "hljs.configure({tabReplace: \"    \"});"),
	]),
	t("body", {}, [
		t("div", { id: "main", }, [
			t("div", { id: "sidebar", class: "panel", }, [
				t("div", { id: "logo", }, [
					t("img", { id: "boom", src: "/pub/img/boom.svg", }),
					t("img", { id: "ka", src: "/pub/img/ka.svg", }),
				]),
				t("a", { class: "link", href: "/guide", }, "guide"),
				t("a", { class: "link", href: "/examples", }, "examples"),
				t("a", { class: "link", href: "/lib", }, "download"),
				t("a", { class: "link", href: "https://github.com/replit/kaboom", }, "github"),
				t("a", { class: "link", href: "https://replit.com/new/kaboom", }, "try on replit"),
				...api.map((sec) => {
					return t("div", { class: "section", }, [
						t("p", { class: "title", }, sec.name),
						t("div", {}, sec.entries.map((f) => {
							return t("a", { class: "link", href: `#${f.name}`, }, `${f.name}()`);
						})),
					]);
				})
			]),
			t("div", { id: "content", class: "panel", }, [
				t("p", { id: "about", }, "kaboom.js (beta) is a JavaScript library that helps you make games fast and fun!"),
				t("p", { class: "title", }, "Usage"),
				t("p", { class: "desc", }, "quick start"),
				code(`
<script src="https://kaboomjs.com/lib/0.1.0/kaboom.js"></script>
<script type="module">

// make kaboom functions global
kaboom.global();

// init kaboom context
init();

// define a scene
scene("main", () => {

	// add a text at position (100, 100)
	add([
		text("ohhimark", 32),
		pos(100, 100),
	]);

});

// start the game
start("main");

</script>
				`, "html"),
				t("img", { id: "chill", src: "/pub/img/chill.png", }),
				...api.map((sec) => {
					return t("div", {}, [
						t("p", { class: "title", }, sec.name),
						t("p", { class: "desc", }, sec.desc),
						...sec.entries.map((f) => {
							let paren = "(";
							f.args.forEach((arg, i) => {
								paren += arg.name + (i === f.args.length - 1 ? "" : ", ");
							});
							paren += ")";
							return t("div", { id: f.name, class: "entry", }, [
								t("p", { class: "name", }, f.name + paren),
								t("p", { class: "desc", }, f.desc),
								f.example ? t("pre", {}, [
									t("code", { class: "javascript", }, f.example.trim()),
								]) : null,
							]);
						}),
					]);
				})
			]),
		]),
	]),
]);

module.exports = "<!DOCTYPE html>" + page;
