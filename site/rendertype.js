const typeData = require("./typeData");
const www = require("./www");
const t = www.tag;

function renderParams(params) {
	return params.map((p) => {
		return p.name
			+ (p.questionToken ? "?" : "")
			+ ": " + (p.dotDotDotToken ? "..." : t("span", {
				class: "typesig",
			}, renderTypeSig(p.type)))
			;
	}).join(", ");
}

function typeExists(name) {
	return typeData.types[name] || typeData.interfaces[name];
}

function renderTypeSig(type) {

	const tname = (() => {
		switch (type.kind) {
			case "StringKeyword": return "string";
			case "NumberKeyword": return "number";
			case "BooleanKeyword": return "boolean";
			case "VoidKeyword": return "void";
			case "AnyKeyword": return "any";
			case "ArrayType": return `${renderTypeSig(type.elementType)}[]`;
			case "ParenthesizedType": return `(${renderTypeSig(type.type)})`;
			case "UnionType": return type.types.map(renderTypeSig).join(" | ");
			case "LiteralType": return renderTypeSig(type.literal);
			case "StringLiteral": return `"${type.text}"`;
			case "FunctionType": return `(${renderParams(type.parameters)}) => ${renderTypeSig(type.type)}`;
			case "TypeReference": return typeExists(type.typeName) ? t("a", {
				class: "typeref",
				href: `/type/${type.typeName}`,
				target: "__blank",
			}, type.typeName) : type.typeName;
			default: return "";
		}
	})();

	if (type.typeArguments) {
		return tname + `&lt;${type.typeArguments.map(renderTypeSig).join(", ")}&gt;`;
	}

	return tname;

}

function renderNamedFunc(type) {
	return `${type.name}(${renderParams(type.parameters)})${type.type ? t("span", {
		class: "typesig",
	}, " => " + renderTypeSig(type.type)) : ""}`;
}

function renderMember(m) {
	switch (m.kind) {
		case "MethodSignature":
			return renderNamedFunc(m);
		case "PropertySignature":
			return m.name
				+ (m.questionToken ? "?" : "")
				+ ": "
				+ t("span", {
					class: "typesig",
				}, renderTypeSig(m.type));
	}
}

function renderTypeAlias(type) {
	switch (type.type.kind) {
		case "TypeLiteral":
			const memberList = type.type.members
				.map(renderMember)
				.map((entry) => "&nbsp;".repeat(4) + entry)
				.join(t("br"));
			return `${type.name} {${t("br")}${memberList}${t("br")}}`;
		case "TypeReference":
		case "UnionType":
		case "FunctionType":
			return `${type.name} = ${renderTypeSig(type.type)}`;
	}
}

function renderInterface(type) {
	const memberList = type.members
		.map(renderMember)
		.map((entry) => "&nbsp;".repeat(4) + entry)
		.join(t("br"));
	return `${type.name} {${t("br")}${memberList}${t("br")}}`;
}

module.exports = {
	renderParams,
	renderTypeSig,
	renderNamedFunc,
	renderMember,
	renderTypeAlias,
	renderInterface,
};
