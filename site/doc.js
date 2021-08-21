// mian page

const www = require("./www");
const api = require("./api");
const gstyle = require("./gstyle");
const utils = require("./utils");
const typeData = require("./typeData");
const {
	renderNamedFunc,
	renderMember,
	renderTypeAlias,
} = require("./rendertype");
const t = www.tag;

const style = {

	"body": {
		"background": "#0080ff",
		"position": "relative",
		"padding": "1px",
	},

	"a": {
		"color": "#0080ff",
	},

	"#typebox": {
		"background": "white",
		"position": "absolute",
		"z-index": "100",
		"border-radius": "12px",
		"border": "black solid 2px",
		"padding": "12px",
		"font-size": "16px",
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
		"outline": "none",
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

	".typesig": {
		"color": "#999999",
	},

	".typeref": {
		"color": "#999999",
		"text-decoration": "underline",
		"cursor": "pointer",
		":hover": {
			"color": "#666666",
		},
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

const versions = utils.versions();
const renderedTypes = {};

renderedTypes["kaboom"] = renderNamedFunc(typeData.funcs["kaboom"]);

typeData.types["KaboomCtx"].type.members.forEach((m) => {
	renderedTypes[m.name] = renderMember(m);
});

Object.values(typeData.types).forEach((t) => {
	renderedTypes[t.name] = renderTypeAlias(t);
});

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "KaBoom!!!"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.style(gstyle)),
		t("style", {}, www.style(style)),
			t("link", { rel: "icon", href: "/pub/img/kaboom.png"}),
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
				t("a", { class: "link", href: "https://twitter.com/Kaboomjs", }, "twitter"),
				t("a", { class: "link", href: "/changelog", }, "changelog"),
				t("a", { class: "link", href: "https://replit.com/new/kaboom", }, "try on replit"),
				...api.map((sec) => {
					return t("div", { class: "section", }, [
						t("p", { class: "title", }, sec.name),
						t("div", {}, sec.entries.map((f) => {
							return t("a", { class: "link", href: `#${f.name}`, }, `${f.name}()`);
						})),
					]);
				}),
			]),
			t("div", { id: "content", class: "panel", }, [
				t("p", { id: "about", }, "kaboom.js is a JavaScript library that helps you make games fast and fun!"),
//				t("img", { id: "chill", src: "/pub/img/chill.png", }),
				t("video", {
					id: "chill",
					poster: "/pub/img/chill2.png",
					controls: true,
				}, [
					t("source", { src: "https://cms.replit.com/assets/kaboom/kaboom.mp4", type: "video/mp4", }),
				]),
				t("p", {}, [
					"also check out the ",
					t("a", { href: "https://replit.com/kaboom", target: "_blank", }, "kaboom environment"),
					" on replit.com!",
				]),
				t("p", { class: "title", }, "Usage"),
				t("p", { class: "desc", }, "quick start"),
				code(`
<script src="https://unpkg.com/kaboom@next/dist/kaboom.js"></script>
<script type="module">

// initialize kaboom context
const k = kaboom();

// add a text of size 32 at position (100, 100)
k.add([
	k.text("oh hi", 32),
	k.pos(100, 100),
]);

</script>
				`, "html"),
				...api.map((sec) => {
					return t("div", {}, [
						t("p", { class: "title", }, sec.name),
						t("p", { class: "desc", }, sec.desc),
						...sec.entries.map((f) => {
							return t("div", { id: f.name, class: "entry", }, [
								t("p", { class: "name", }, renderedTypes[f.name] || ""),
								t("p", { class: "desc", }, f.desc),
								f.example ? t("pre", {}, [
									t("code", { class: "javascript", }, f.example.trim()),
								]) : null,
							]);
						}),
					]);
				}),
				t("div", {}, [
					t("p", { class: "title", }, "Custom Component"),
					t("p", { class: "desc", }, "a component describes a single unit of data / behavior"),
					code(`
const player = add([
	sprite("froggy"),
	// custom components are used just like other components
	health(12),
]);

// create a custom component that handles health
function health(hp) {
	return {
		// comp id (if not it'll be treated like custom fields on the game object)
		id: "health",
		// comp dependencies (will throw if the host object doesn't contain these components)
		require: [],
		// custom behaviors
		hurt(n) {
			hp -= n ?? 1;
			// trigger custom events
			this.trigger("hurt");
			if (hp <= 0) {
				this.trigger("death");
			}
		},
		heal(n) {
			hp += n ?? 1;
			this.trigger("heal");
		},
		hp() {
			return hp;
		},
	};
}

// listen to custom events from a custom component
player.on("hurt", () => { ... });

// decoupled discrete logic
player.collides("enemy", () => player.hurt(1));

const boss = add([
	health(12),
]);

boss.collides("bullet", () => {
	boss.hurt(1);
});

boss.on("death", () => {
	makeExplosion();
	wait(1, () => {
		destroy(enemy);
	});
});

// another custom component that enables drag and drop
function drag() {

	// private states
	let draggin = false;
	let removeEvent;

	return {

		id: "drag",

		// we need the 'pos' and 'click' methods from "pos" and "area" comps
		require: [ "pos", "area" ],

		// LIFE CYCLE, called when the object is add()-ed
		add() {
			this.clicks(() => {
				draggin = true;
			});
			// TODO: remove this event when destroyed
			removeEvent = mouseRelease(() => {
				draggin = false;
			});
		},

		// LIFE CYCLE, called every frame
		update() {
			if (draggin) {
				this.pos = mousePos();
			}
		},

		// LIFE CYCLE, called when object is destroy()-ed
		destroy() {
			removeEvent();
		},

	};

}

// for more custom component examples, look at the implementations of the built-in comps in kaboom.ts
					`),
				]),
				t("div", {}, [
					t("p", { class: "title", }, "Plugin System"),
					t("p", { class: "desc", }, "how to make / use plugins"),
					code(`
// create a function that takes in the kaboom context handle, and return an object, the entries of the returned object will get assigned to the kaboom context
function testPlugin(k) {
	return {
		timePlusOne() {
			return k.time() + 1;
		},
	};
}

const k = kaboom({
	global: true,
	plugins: [ testPlugin, ],
});

// it gets assigned to the kaboom context handle
k.timePlusOne();
// it also works with global flag
timePlusOne();
					`),
				]),
			]),
		]),
		t("div", { id: "typebox", }, ""),
		t("script", {}, `window.renderedTypes = ${JSON.stringify(renderedTypes)}`),
		t("script", { src: "/pub/js/doc.js", }, ""),
	]),
]);

module.exports = "<!DOCTYPE html>" + page;
