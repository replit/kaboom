const www = require("./www");
const gstyle = require("./gstyle");
const t = www.tag;

module.exports = (name) => {

	const page = t("html", {}, [
		t("head", {}, [
			t("meta", { name: "twitter:card", content: "summary_large_image", }),
			t("meta", { name: "twitter:site", content: "@Kaboomjs", }),
			t("meta", { name: "twitter:title", content: name, }),
			t("meta", { name: "twitter:description", content: name, }),
			t("meta", { name: "twitter:image", content: `https://kaboomjs.com/pub/img/chill.png`, }),
			t("meta", { name: "twitter:url", content: `https://kaboomjs.com/example/${name}`, }),
			t("style", {}, www.style(gstyle)),
			t("script", { src: "/lib/dev/kaboom.js", }, ""),
		]),
		t("body", {}, [
			t("script", { src: `/pub/examples/${name}.js`, }, ""),
		]),
	]);

	return "<!DOCTYPE html>" + page;

}
