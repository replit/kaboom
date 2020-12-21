// reference page

const fs = require("fs");
const dofile = require("./dofile");
const www = dofile("./www");
const api = dofile("./api");
const styles = dofile("./styles");
const t = www.tag;

const styles2 = {

	"#main": {
		"width": "70%",
		"margin": "64px auto",
	},

	"code": {
		"padding": "6px !important",
	},

	"#sidebar": {

		"width": "20%",
		"position": "fixed",

		".section": {

			".title": {
				"font-size": "18px",
				"font-weight": "bold",
				"margin-top": "16px",
				"margin-bottom": "12px",
			},

			".entry": {
				"font-size": "16px",
				"display": "table",
				"color": "blue",
				":hover": {
					"text-decoration": "underline",
					"cursor": "pointer",
				},
				":visited": {
					"color": "blue",
				},
			},
		},

	},

	"#content": {

		"width": "80%",
		"float": "right",

		".entry": {

			"width": "100%",
			"margin-bottom": "24px",

			".title": {
				"font-size": "24px",
				"display": "block",
				"margin-bottom": "16px",
			},

			".desc": {
				"font-size": "16px",
				"word-wrap": "break-word",
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
			t("div", { id: "sidebar", }, api.map((sec) => {
				return t("div", { class: "section", }, [
					t("p", { class: "title", }, sec.name),
					t("div", {}, sec.functions.map((f) => {
						return t("a", { class: "entry", href: `#${f.name}`, }, `${f.name}()`);
					})),
				]);
			})),
			t("div", { id: "content", }, api.map((sec) => {
				return t("div", {}, [
					t("p", {}, sec.name),
					t("p", {}, sec.desc),
					...sec.functions.map((f) => {
						let paren = "(";
						for (const arg of f.args) {
							paren += arg.name + ", ";
						}
						paren += ")";
						return t("div", { id: f.name, class: "entry", }, [
							t("a", { class: "title", }, f.name + paren),
							t("p", { class: "desc", }, f.desc),
							f.example ? t("pre", {}, [
								t("code", { class: "javascript", }, f.example.trim()),
							]) : null,
						]);
					}),
				]);
			})),
		]),
	]),
]);

module.exports = "<!DOCTYPE html>" + page;

