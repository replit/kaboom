const dofile = require("./dofile");
const www = dofile("./www");
const api = dofile("./api");
const t = www.tag;

const styles = {

	"*": {
		"margin": "0",
		"padding": "0",
		"font-family": "Monospace",
	},

	"html": {
		"width": "100%",
	},

	"body": {
		"width": "100%",
	},

	"#main": {

		"width": "80%",
		"margin": "64px auto",

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

			"width": "84%",
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

	},

};

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "gamelib"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.style(styles)),
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
				return t("div", {}, sec.functions.map((f) => {
					let paren = "(";
					for (const arg of f.args) {
						paren += arg.name + ", ";
					}
					paren += ")";
					return t("div", { id: f.name, class: "entry", }, [
						t("a", { class: "title", }, f.name + paren),
						t("p", { class: "desc", }, f.desc),
					]);
				}));
			})),
		]),
	]),
]);

module.exports = page;

