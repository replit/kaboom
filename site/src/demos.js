const path = require("path");
const fs = require("fs");
const www = require("./www");
const gstyle = require("./gstyle");
const t = www.tag;

const css = {
	...gstyle,
	"#editor": {
		"width": "50%",
		"height": "100%",
		"overflow": "scroll",
	},
	"#view": {
		"width": "50%",
		"height": "100%",
		"background": "black",
		"border": "none",
	},
};

const demos = {};

fs.readdirSync("../demos").forEach((file) => {
	if (file.startsWith(".")) {
		return;
	}
	const p = path.resolve("../demos", file);
	const name = path.basename(file, path.extname(file));
	const stat = fs.statSync(p);
	if (!stat.isFile()) {
		return;
	}
	demos[name] = fs.readFileSync(p, "utf-8");
}, {});

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "Kaboom Demos"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.css(css)),
		t("link", { rel: "icon", href: "/img/kaboom.png"}),
		t("script", {}, `window.demos = ${JSON.stringify(demos)}`),
		t("script", { src: "/js/demos.js", type: "module" }, ""),
	]),
	t("body", {}, [
		t("div", { id: "editor", }, []),
		t("iframe", { id: "view", }, []),
	]),
]);

module.exports = page;
