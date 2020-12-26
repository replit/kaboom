// reference page

const fs = require("fs");
const dofile = require("./dofile");
const www = dofile("./www");
const api = dofile("./api");
const styles = dofile("./styles");
const t = www.tag;

const styles2 = {

	"body": {
// 		"background": "#0080ff",
		"background": "#80ffff",
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
			"margin-bottom": "12px",
			":hover": {
				"cursor": "pointer",
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
			"margin-top": "12px",
		},

		".desc": {
			"font-size": "20px",
			"margin-bottom": "24px",
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
			},

		},

	},

};

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "KaBoom!!!"),
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
			t("div", { id: "sidebar", class: "panel", }, [
				t("img", { id: "logo", src: "data:image/png;base64," + fs.readFileSync(`${__dirname}/res/kaboom.png`, "base64") }),
				t("a", { class: "link", href: "/guide", }, "guide"),
				t("a", { class: "link", href: "https://github.com/replit/kaboom", }, "github"),
				t("a", { class: "link", href: "https://raw.githubusercontent.com/replit/kaboom/master/kaboom.js", }, "download"),
				...api.map((sec) => {
					return t("div", { class: "section", }, [
						t("p", { class: "title", }, sec.name),
						t("div", {}, sec.functions.map((f) => {
							return t("a", { class: "link", href: `#${f.name}`, }, `${f.name}()`);
						})),
					]);
				})
			]),
			t("div", { id: "content", class: "panel", }, [
				t("p", { id: "about", }, "kaboom.js is a JavaScript library that helps you make games!"),
				...api.map((sec) => {
					return t("div", {}, [
						t("p", { class: "title", }, sec.name),
						t("p", { class: "desc", }, sec.desc),
						...sec.functions.map((f) => {
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

