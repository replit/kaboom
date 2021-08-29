const marked = require("marked");
const hljs = require("highlight.js");
const www = require("./www");
const types = require("./../types");
const t = www.tag;

marked.setOptions({
	highlight: function(code, lang) {
		return hljs.highlight(code, {
			language: lang,
		}).value;
	}
});

const entries = Object.keys(types);
const ctxMembers = types["KaboomCtx"].members;

const space = (side, n = 12) => ({
	"> *": {
		[`margin-${side}`]: `${n}px`,
		":last-child": {
			[`margin-${side}`]: "0",
		},
	},
});

const vspace = (n) => space("bottom", n);
const hspace = (n) => space("right", n);

const css = {
	"*": {
		"padding": "0",
		"margin": "0",
		"box-sizing": "border-box",
		"font-family": "IBM Plex Sans",
		"color": "#333333",
	},
	"html": {
		"width": "100%",
		"height": "100%",
	},
	"body": {
		"width": "100%",
		"height": "100%",
		"display": "flex",
	},
	"#sidebar": {
		...vspace(12),
		"background": "#f5f5f5",
		"width": "20%",
		"padding": "24px",
		"overflow": "scroll",
		"#logo": {
			"width": "60%",
		},
		"#search": {
			"padding": "12px",
			"outline": "none",
			"border": "none",
			"font-size": "16px",
			"width": "100%",
		},
		"#index": {
			...vspace(4),
			"a": {
				"display": "table",
				"font-family": "IBM Plex Mono",
				"text-decoration": "none",
				"color": "black",
				":visited": {
					"color": "black",
				},
			},
		}
	},
	"#content": {
		...vspace(12),
		"overflow": "scroll",
		"padding": "48px",
		"background": "#ffffff",
		".header": {
			"padding": "9px 12px",
			"background": "#fff8bc",
			"color": "black",
			"font-size": "24px",
			"font-weight": "bold",
			"display": "inline-block",
		},
		".body": {
			"font-size": "24px",
		},
		".name": {
			"font-family": "IBM Plex Mono",
			"font-size": "32px",
		},
		".desc": {
			"font-size": "24px",
			"color": "#666666",
		},
		".section": {
			...vspace(12),
		},
		".item": {
			...vspace(12),
		},
		"code": {
			"font-family": "IBM Plex Mono",
			"span": {
				"font-family": "IBM Plex Mono",
			},
		},
		"pre": {
			"overflow": "scroll",
			"font-family": "IBM Plex Mono",
			"background": "#fafafa",
			"padding": "12px",
			"border": "solid 2px #eaeaea",
		},
	},
};

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "KaBoom!!!"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.css(css)),
		t("link", { rel: "icon", href: "/img/kaboom.png"}),
		t("link", { rel: "stylesheet", href: "/lib/paraiso.css"}),
		t("script", { src: "/js/doc.js"}, ""),
	]),
	t("body", {}, [
		t("div", { id: "sidebar", }, [
			t("img", { id: "logo", src: "/img/kaboom.svg" }),
			t("input", { id: "search", placeholder: "search in docs", }),
			t("div", { id: "index", }, ctxMembers.map((mem) => {
				if (!mem.name) {
					return;
				}
				let name = mem.name;
				if (mem.kind === "MethodSignature") {
					name += "()";
				}
				return t("a", { href: `#${mem.name}`, }, name);
			})),
		]),
		t("div", { id: "content", }, [
			t("div", { class: "header", }, "Intro"),
			t("div", { class: "body", }, "Kaboom.js is a JavaScript game programming library that helps you make games fast and fun!"),
			t("div", { class: "section", }, ctxMembers.map((mem) => {
				if (!mem.name) {
					return;
				}
				let name = mem.name;
				if (mem.kind === "MethodSignature") {
					name += "()";
				}
				const doc = mem.jsDoc?.[0];
				const items = [
					t("div", { class: "name", }, name),
				];
				if (doc) {
					items.push(t("div", { class: "desc", }, doc.comment));
					if (doc.tags) {
						for (const tag of doc.tags) {
							switch (tag.tagName) {
								case "example":
									const html = marked(tag.comment);
									items.push(html);
									break;
							}
						}
					}
				}
				return t("div", { id: mem.name, class: "item", }, items);
			})),
		]),
	]),
]);

module.exports = page;
