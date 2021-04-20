const www = require("./www");
const t = www.tag;

module.exports = (conf) => {

	const page = t("html", {}, [
		t("head", {}, [
			t("meta", { name: "twitter:card", content: "player", }),
			t("meta", { name: "twitter:site", content: "@Kaboomjs", }),
			t("meta", { name: "twitter:title", content: conf.title, }),
			t("meta", { name: "twitter:description", content: conf.desc, }),
			t("meta", { name: "twitter:image", content: conf.image, }),
			t("meta", { name: "twitter:player", content: conf.url, }),
			t("meta", { name: "twitter:player:width", content: conf.width, }),
			t("meta", { name: "twitter:player:height", content: conf.height, }),
		]),
		t("body", {}, []),
	]);

	return "<!DOCTYPE html>" + page;

}
