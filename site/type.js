const www = require("./www");
const gstyle = require("./gstyle");
const typeData = require("./typeData");
const {
	renderNamedFunc,
	renderMember,
	renderTypeAlias,
} = require("./rendertype");
const t = www.tag;

module.exports = (name) => {

	const page = t("html", {}, [
		t("head", {}, []),
		t("body", {}, renderTypeAlias(typeData.types[name])),
	]);

	return "<!DOCTYPE html>" + page;

};
