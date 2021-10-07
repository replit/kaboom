const path = require("path");
const fs = require("fs");
const www = require("./www");
const global = require("./global");
const t = www.tag;

const horiAspect = "1/1";

const css = {
	"body": {
		"display": "flex",
		"flex-direction": "column",
		"body": "100%",
		"height": "100%",
	},
	"#header": {
		"width": "100%",
		"height": "48px",
		"overflow": "hidden",
		"display": "flex",
		"align-items": "center",
		"padding": "0 16px",
		"justify-content": "space-between",
		"background": "var(--color-bg2)",
		"> div": {
			...www.hspace(16),
			"display": "flex",
			"align-items": "center",
			"height": "100%",
		},
		"#logo": {
			"height": "96px",
		},
	},
	"#content": {
		"width": "100%",
		"height": "calc(100% - 48px)",
		"display": "flex",
		"@media": {
			[`(max-aspect-ratio: ${horiAspect})`]: {
				"flex-direction": "column-reverse",
			},
		},
	},
	"#editor": {
		"width": "50%",
		"height": "100%",
		"overflow": "scroll",
		"font-family": "IBM Plex Mono",
		"font-size": "24px",
		"@media": {
			[`(max-aspect-ratio: ${horiAspect})`]: {
				"flex-order": "1",
				"width": "100%",
				"height": "50%",
			},
			"(max-device-width: 640px)": {
				"font-size": "48px",
			},
		},
		".cm-focused": {
			"outline": "none !important",
		},
	},
	"#view": {
		"width": "50%",
		"height": "100%",
		"background": "black",
		"border": "none",
		"@media": {
			[`(max-aspect-ratio: ${horiAspect})`]: {
				"flex-order": "2",
				"width": "100%",
				"height": "50%",
			},
		},
	},
};

const DEF_DEMO = "runner";

module.exports = () => {

	const demos = {};

	fs.readdirSync(path.resolve(__dirname, "../demo")).forEach((file) => {
		if (file.startsWith(".")) {
			return;
		}
		const p = path.resolve(__dirname, "../demo", file);
		const name = path.basename(file, path.extname(file));
		const stat = fs.statSync(p);
		if (!stat.isFile()) {
			return;
		}
		demos[name] = fs.readFileSync(p, "utf-8");
	}, {});

	return t("html", {}, [
		t("head", {}, [
			...global.head,
			t("title", {}, "Kaboom Demos"),
			t("style", {}, www.css(css)),
			t("script", {}, `window.demos = ${JSON.stringify(demos)}`),
		]),
		t("body", {}, [
			t("div", { id: "header", }, [
				t("div", {}, [
					t("a", { href: "/", }, [
						t("img", { id: "logo", src: "/site/img/kaboom.svg", }),
					]),
					t("select", {
						id: "selector",
						name: "demo",
					}, Object.keys(demos).map((name) => {
						return t("option", { selected: name === DEF_DEMO, }, name);
					})),
					t("button", { id: "run", }, "Run"),
				]),
				t("div", {}, [
					t("input", { id: "themeswitch", type: "checkbox", name: "themeswitch", style: "display: none" }, ""),
					t("label", { for: "themeswitch", class: "switch theme", }, [
						t("div", { class: "strip", }, [
							t("div", { class: "ball", }, []),
						]),
					]),
					t("button", {}, "Reset"),
				]),
			]),
			t("div", { id: "content", }, [
				t("div", { id: "editor", }, []),
				t("iframe", { id: "view", }, []),
			]),
			t("script", { src: "/site/js/demo.js", type: "module" }, ""),
		]),
	]);

};
