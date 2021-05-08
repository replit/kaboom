const www = require("./www");
const types = require("./types");
const t = www.tag;

function renderParams(params) {
	return params.map((p) => {
		return p.name
			+ (p.questionToken ? "?" : "")
			+ ": " + (p.dotDotDotToken ? "..." : renderTypeSig(p.type))
			;
	}).join(", ");
}

function typeExists(name) {
	return types.types[name] || types.interfaces[name];
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
				href: `#${type.typeName}`,
			}, type.typeName) : type.typeName;
			default: return "";
		}
	})();

	if (type.typeArguments) {
		return tname + `<${type.typeArguments.map((arg, idx) => {
			return renderTypeSig(arg) + (idx === type.typeArguments.length - 1 ? "" : ", ");
		})}>`;
	}

	return tname;

}

function renderNamedFunc(type) {
	return `${type.name}(${renderParams(type.parameters)}): ${renderTypeSig(type.type)}`;
}

function typeLiteralEntries(members) {
	return members.map((member) => {
		switch (member.kind) {
			case "MethodSignature":
				return renderNamedFunc(member);
			case "PropertySignature":
				return member.name
					+ (member.questionToken ? "?" : "")
					+ ": "
					+ renderTypeSig(member.type);
		}
	});
}

function renderTypeAlias(type) {
	switch (type.type.kind) {
		case "TypeLiteral":
			return `${type.name} {${t("br")}${typeLiteralEntries(type.type.members).map((entry) => "&nbsp;".repeat(8) + entry).join(t("br"))}${t("br")}}`;
		case "TypeReference":
		case "UnionType":
			return `${type.name} = ${renderTypeSig(type.type)}`;
	}
}

function genDoc() {
// 	return renderNamedFunc(types.funcs["kaboom"]);
	return Object.entries(types.types).map(([k, v]) => {
		return t("div", { id: k, }, renderTypeAlias(v));
	}).join("");
}

console.log(genDoc());

module.exports = genDoc;
