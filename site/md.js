const fs = require("fs");
const path = require("path");
const marked = require("marked");
const hljs = require("highlight.js");
const www = require("./www");
const global = require("./global");
const t = www.tag;

marked.setOptions({
	highlight: (code, lang) => {
		return hljs.highlight(code, {
			language: lang,
		}).value;
	}
});

module.exports = (p) => {
	return t("html", { "data-theme": "dark", }, [
		t("head", {}, [
			...global.head,
			t("title", {}, path.basename(p)),
			t("style", {}, www.css({
				"body": {
					"position": "relative",
				},
				"#content": {
					"font-size": "20px",
					"line-height": "1.6",
					"margin": "32px auto",
					"width": "800px",
					"max-width": "80%",
					...www.vspace(32),
					"*": {
						"max-width": "100%",
					},
					"@media": {
						"(max-device-width: 640px)": {
							"width": "90%",
							"font-size": "48px",
						},
					},
				},
				"label[for='themeswitch']": {
					"position": "fixed",
					"right": "16px",
					"bottom": "16px",
				},
			})),
			t("link", { rel: "stylesheet", href: "/site/css/paraiso.css"}),
		]),
		t("body", {}, [
			t("div", { id: "content", }, marked(fs.readFileSync(p, "utf-8"))),
			t("input", { id: "themeswitch", type: "checkbox", name: "themeswitch", style: "display: none" }, ""),
			t("label", { for: "themeswitch", class: "switch theme", }, [
				t("div", { class: "strip", }, [
					t("div", { class: "ball", }, []),
				]),
			]),
			t("script", { src: "/site/js/md.js", }, ""),
		]),
	]);
};
