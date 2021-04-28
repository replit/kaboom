const www = require("./ext/www");
const gstyle = require("./gstyle");
const t = www.tag;

module.exports = (name) => {

	const page = t("html", {}, [
		t("head", {}, [
			t("meta", { name: "twitter:card", content: "player", }),
			t("meta", { name: "twitter:site", content: "@Kaboomjs", }),
			t("meta", { name: "twitter:title", content: name, }),
			t("meta", { name: "twitter:description", content: `kaboom.js example - ${name}`, }),
			t("meta", { name: "twitter:image", content: "https://kaboomjs.com/pub/img/chill.png", }),
			t("meta", { name: "twitter:player", content: `https://kaboomjs.com/example/${name}`, }),
			t("meta", { name: "twitter:player:width", content: "480", }),
			t("meta", { name: "twitter:player:height", content: "480", }),
			t("style", {}, www.style(gstyle)),
			t("script", { src: "/lib/dev/kaboom.js", }, ""),
			t("script", { src: "/lib/dev/plugins/aseprite.js", }, ""),
			t("script", { src: "/lib/dev/plugins/pedit.js", }, ""),
			t("script", { src: "/lib/dev/plugins/cp437.js", }, ""),
			t("script", { src: "/lib/dev/plugins/04b03.js", }, ""),
		]),
		t("body", {}, [
			t("script", { src: `/pub/examples/${name}.js`, }, ""),
		]),
	]);

	return "<!DOCTYPE html>" + page;

};
