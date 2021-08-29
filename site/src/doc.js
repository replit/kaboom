const marked = require("marked");
const hljs = require("highlight.js");
const www = require("./www");
const gstyle = require("./gstyle");
const types = require("./../types");
const t = www.tag;

marked.setOptions({
	highlight: function(code, lang) {
		return hljs.highlight(code, {
			language: lang,
		}).value;
	}
});

const entries = Object.keys(types);
const ctxMembers = types["KaboomCtx"].members;

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

function renderTypeSig(type) {
	if (!type) {
		return "";
	}
	let tname = (() => {
		switch (type.kind) {
			case "StringKeyword": return "string";
			case "NumberKeyword": return "number";
			case "BooleanKeyword": return "boolean";
			case "VoidKeyword": return "void";
			case "AnyKeyword": return "any";
			case "NullKeyword": return "null";
			case "UnionType": return type.types.map(renderTypeSig).join(" | ");
			case "LiteralType": return renderTypeSig(type.literal);
			case "StringLiteral": return `"${type.text}"`;
			case "ArrayType": return `${renderTypeSig(type.elementType)}[]`;
			case "ParenthesizedType": return `(${renderTypeSig(type.type)})`;
			case "TypeReference": return types[type.typeName] ? t("a", {
				href: `#${type.typeName}`,
			}, type.typeName) : type.typeName;
			case "FunctionType": return `(${renderParams(type.parameters)}) => ${renderTypeSig(type.type)}`;
			default: return "";
		}
	})();
	if (type.typeArguments) {
		tname += `&lt;${type.typeArguments.map(renderTypeSig).join(", ")}&gt;`;
	}
	return t("span", { class: "typesig", }, tname);
}

function renderNamedFunc(func) {
	let code = `${func.name}(${renderParams(func.parameters)})`;
	if (func.type?.kind !== "VoidKeyword") {
		code += `=> ${renderTypeSig(func.type)}`;
	}
	return code;
}

function renderMember(m) {
	switch (m.kind) {
		case "MethodSignature":
			return renderNamedFunc(m);
		case "PropertySignature":
			return m.name
				+ (m.questionToken ? "?" : "")
				+ ": "
				+ renderTypeSig(m.type);
	}
}

function renderTypeAlias(type) {
	switch (type.type.kind) {
		case "TypeLiteral":
			const memberList = type.type.members
				.map(renderMember)
				.map((entry) => "&nbsp;".repeat(4) + entry)
				.join(t("br"));
			return `{${t("br")}${memberList}${t("br")}}`;
		case "TypeReference":
		case "UnionType":
		case "FunctionType":
			return `${renderTypeSig(type.type)}`;
	}
}

function renderInterface(type) {
	const memberList = type.members
		.map(renderMember)
		.map((entry) => "&nbsp;".repeat(4) + entry)
		.join(t("br"));
	return `{${t("br")}${memberList}${t("br")}}`;
}

function renderStmt(stmt) {
	switch (stmt.kind) {
		case "TypeAliasDeclaration": return renderTypeAlias(stmt);
		case "InterfaceDeclaration": return renderInterface(stmt);
		default: "";
	}
}

function renderJSDoc(type) {
	const doc = type.jsDoc?.[0];
	const items = [];
	if (!doc) {
		return items;
	}
	items.push(t("div", { class: "desc", }, doc.comment));
	if (doc.tags) {
		for (const tag of doc.tags) {
			switch (tag.tagName) {
				case "example":
					items.push(marked(tag.comment));
					break;
			}
		}
	}
	return items;
}

const css = {
	...gstyle,
	"#sidebar": {
		...www.vspace(12),
		"background": "#f5f5f5",
		"width": "240px",
		"padding": "24px",
		"overflow": "scroll",
		"#logo": {
			"width": "60%",
		},
		"#search": {
			"padding": "8px 12px",
			"outline": "none",
			"border": "none",
			"font-size": "16px",
			"width": "100%",
			"border-radius": "6px",
		},
		"#index": {
			...www.vspace(4),
			"a": {
				"display": "table",
				"font-family": "IBM Plex Mono",
				"text-decoration": "none",
				"color": "#333333",
				"padding": "4px",
				"border-radius": "4px",
				":hover": {
					"color": "#ffffff !important",
					"background": "#0080ff",
				},
				":visited": {
					"color": "inherit",
				},
			},
		}
	},
	"#content": {
		...www.vspace(12),
		"overflow": "scroll",
		"padding": "48px",
		"background": "#ffffff",
		"flex": "1",
		".title": {
			"padding": "9px 12px",
			"background": "#fff8bc",
			"color": "#333333",
			"font-size": "24px",
			"font-weight": "bold",
			"display": "inline-block",
			"border-radius": "12px",
		},
		".body": {
			"font-size": "24px",
		},
		".name": {
			"font-family": "IBM Plex Mono",
			"font-size": "32px",
		},
		".desc": {
			"font-size": "24px",
			"color": "#666666",
		},
		".section": {
			...www.vspace(32),
		},
		".item": {
			...www.vspace(12),
		},
		".type": {
			"font-family": "IBM Plex Mono",
			"font-size": "20px",
		},
		".typesig": {
			"color": "#999999",
			"a": {
				"color": "#999999",
				":hover": {
					"color": "#666666 !important",
				},
				":visited": {
					"color": "#999999",
				},
			},
		},
		"pre": {
			"overflow": "scroll",
			"font-family": "IBM Plex Mono",
			"background": "#fafafa",
			"padding": "12px",
			"border": "solid 2px #eaeaea",
			"border-radius": "12px",
		},
	},
};

const page = t("html", {}, [
	t("head", {}, [
		t("title", {}, "KaBoom!!!"),
		t("meta", { charset: "utf-8", }),
		t("style", {}, www.css(css)),
		t("link", { rel: "icon", href: "/img/kaboom.png"}),
		t("link", { rel: "stylesheet", href: "/css/paraiso.css"}),
		t("script", { src: "/js/doc.js", }, ""),
	]),
	t("body", {}, [
		t("div", { id: "sidebar", }, [
			t("img", { id: "logo", src: "/img/kaboom.svg" }),
			t("input", { id: "search", placeholder: "search in docs", }),
			t("div", { id: "index", }, ctxMembers.map((mem) => {
				if (!mem.name) {
					return;
				}
				let name = mem.name;
				if (mem.kind === "MethodSignature") {
					name += "()";
				}
				return t("a", { href: `#${mem.name}`, }, name);
			})),
		]),
		t("div", { id: "content", }, [
			t("div", { class: "title", }, "Intro"),
			t("div", { class: "body", }, "Kaboom.js is a JavaScript game programming library that helps you make games fast and fun!"),
			t("div", { class: "item name", id: "kaboom", }, renderNamedFunc(types["kaboom"])),
			t("div", { class: "section", }, ctxMembers.map((mem) => {
				if (!mem.name) {
					return;
				}
				let name = mem.name;
				if (mem.kind === "MethodSignature") {
					name += "()";
				}
				const doc = mem.jsDoc?.[0];
				const items = [
				];
				return t("div", { id: mem.name, class: "item", }, [
					t("div", { class: "name", }, mem.kind === "MethodSignature" ? renderNamedFunc(mem) : name),
					...renderJSDoc(mem),
				]);
			})),
			t("div", { class: "title", }, "Types"),
			t("div", { class: "section", }, entries.map((name) => {
				if (name === "kaboom") {
					return;
				}
				const mem = types[name];
				return t("div", { class: "item", id: name, }, [
					t("div", { class: "name", }, name),
					...renderJSDoc(mem),
					name !== "KaboomCtx" && t("div", { class: "type", }, renderStmt(mem)),
				]);
			})),
		]),
	]),
]);

module.exports = page;
