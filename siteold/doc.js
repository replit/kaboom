const fs = require("fs");
const path = require("path");
const marked = require("marked");
const hljs = require("highlight.js");
const www = require("./www");
const global = require("./global");
const getTypes = require("./getTypes");
const types = getTypes(fs.readFileSync(path.resolve(__dirname, "../dist/kaboom.d.ts"), "utf-8"));
const t = www.tag;

marked.setOptions({
	highlight: (code, lang) => {
		return hljs.highlight(code, {
			language: lang,
		}).value;
	}
});

const entries = Object.keys(types);
const ctxMembers = types["KaboomCtx"].members;
const sections = [];
let curSection = [];

ctxMembers.forEach((mem) => {
	const tags = mem.jsDoc?.[0].tags ?? [];
	for (const tag of tags) {
		if (tag.tagName === "section") {
			const section = {
				name: tag.comment,
				entries: [],
			};
			sections.push(section);
			curSection = section.entries;
			break;
		}
	}
	curSection.push(mem);
});

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
			case "TypeLiteral":
				const memberList = type.members
					.map(renderMember)
					.map((entry) => "&nbsp;".repeat(4) + entry)
					.join(t("br"));
				return `{${t("br")}${memberList}${t("br")}}`;
			default:
// 				console.log(type);
				return "";
		}
	})();
	if (type.typeArguments) {
		tname += `&lt;${type.typeArguments.map(renderTypeSig).join(", ")}&gt;`;
	}
	return t("span", { class: "typesig", }, tname);
}

function renderNamedFunc(func) {
	let code = `${func.name}(${renderParams(func.parameters)})`;
	if (func.type && func.type?.kind !== "VoidKeyword") {
		code += ` => ${renderTypeSig(func.type)}`;
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
		default:
// 			console.log(m);
			return "";
	}
}

function renderTypeAlias(type) {
	switch (type.kind) {
		case "TypeLiteral":
			const memberList = type.members
				.map(renderMember)
				.map((entry) => "&nbsp;".repeat(4) + entry)
				.join(t("br"));
			return `{${t("br")}${memberList}${t("br")}}`;
		case "TypeReference":
		case "UnionType":
		case "StringKeyword":
		case "NumberKeyword":
		case "BooleanKeyword":
		case "VoidKeyword":
		case "AnyKeyword":
		case "NullKeyword":
		case "FunctionType":
			return `${renderTypeSig(type)}`;
		case "IntersectionType":
			return type.types.map(renderTypeAlias).join(" & ");
		default:
// 			console.log(type);
			return "";
	}
}

function renderInterface(type) {
	const memberList = type.members
		.map(renderMember)
		.join(t("br"));
	return `${memberList}`;
}

function renderStmt(stmt) {
	switch (stmt.kind) {
		case "TypeAliasDeclaration": return renderTypeAlias(stmt.type);
		case "InterfaceDeclaration": return renderInterface(stmt);
		default:
// 			console.log(stmt);
			return "";
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
				case "deprecated":
					// TODO
					break;
				default:
// 					console.log(tag);
					break;
			}
		}
	}
	return items;
}

const css = {
	"body": {
		"display": "flex",
	},
	"#sidebar": {
		"background": "var(--color-bg2)",
		"width": "240px",
		"padding": "24px",
		"overflow": "scroll",
		"@media": {
			"(max-width: 640px)": {
				"display": "none",
			},
		},
		"#logo": {
			"width": "70%",
		},
		".title": {
			"font-weight": "bold",
			"font-size": "24px",
			"color": "var(--color-fg2)",
		},
		"#index": {
			...www.vspace(16),
			".section": {
				...www.vspace(8),
			},
			"a": {
				"font-family": "IBM Plex Mono",
				"display": "table",
				"text-decoration": "none",
				"color": "var(--color-fg)",
				"padding": "2px 6px",
				"border-radius": "6px",
				":hover": {
					"color": "#ffffff !important",
					"background": "var(--color-highlight)",
				},
				":visited": {
					"color": "inherit",
				},
			},
		}
	},
	"#content": {
		"overflow": "scroll",
		"padding": "48px",
		"background": "var(--color-bg)",
		"flex": "1",
		...www.vspace(24),
		".block": {
			...www.vspace(12),
		},
		".title": {
			"padding": "6px 12px",
			"background": "var(--color-title-bg)",
			"color": "var(--color-fg)",
			"font-size": "24px",
			"font-weight": "bold",
			"display": "inline-block",
			"border-radius": "6px",
		},
		".body": {
			"font-size": "24px",
		},
		".name": {
			"font-family": "IBM Plex Mono",
			"font-size": "30px",
		},
		".desc": {
			"font-size": "24px",
			"color": "var(--color-fg2)",
		},
		".item": {
			...www.vspace(12),
		},
		".type": {
			"font-size": "20px",
			"font-family": "IBM Plex Mono",
		},
		".typesig": {
			"color": "var(--color-fg2)",
			"font-family": "IBM Plex Mono",
			"a": {
				"color": "var(--color-fg2)",
				":hover": {
					"color": "var(--color-fg3) !important",
				},
				":visited": {
					"color": "var(--color-fg2)",
				},
			},
		},
	},
};

function block(title, rest) {
	return t("div", { class: "block", }, [
		t("div", { class: "title", }, title),
		...rest,
	]);
}

function code(content, lang = "javascript") {
	return t("pre", {}, [
		t("code", {}, hljs.highlight(content.trim(), {
			language: lang,
		}).value),
	]);
}

function txt(tx) {
	return t("div", { class: "body", }, tx);
}

const page = t("html", {}, [
	t("head", {}, [
		...global.head,
		t("title", {}, "KaBoom!!!"),
		t("style", {}, www.css(css)),
		t("link", { rel: "stylesheet", href: "/site/css/paraiso.css"}),
	]),
	t("body", {}, [
		t("div", { id: "sidebar", }, [
			t("a", { href: "/" }, [
				t("img", { id: "logo", src: "/site/img/kaboom.svg" }),
			]),
			www.spacer(12),
			t("input", { id: "themeswitch", type: "checkbox", name: "themeswitch", style: "display: none" }, ""),
			t("label", { for: "themeswitch", class: "switch theme", }, [
				t("div", { class: "strip", }, [
					t("div", { class: "ball", }, []),
				]),
			]),
			www.spacer(24),
			t("div", { id: "index" }, [
				t("div", { class: "section" }, [
					t("div", { class: "title", }, "Tutorials"),
					t("a", { href: "/doc/setup.md", }, "Setup"),
					t("a", { href: "/doc/intro.md", }, "Intro"),
					t("a", { href: "/doc/comp.md", }, "Component"),
				]),
				...sections.map((sec) => {
					const dups = new Set([]);
					return t("div", { class: "section", }, [
						t("div", { class: "title", }, sec.name),
						t("div", {}, sec.entries.map((mem) => {
							if (!mem.name || dups.has(mem.name)) {
								return;
							}
							dups.add(mem.name);
							let name = mem.name;
							if (mem.kind === "MethodSignature") {
								name += "()";
							}
							return t("a", { href: `#${mem.name}`, }, name);
						})),
					]);
				}),
			]),
		]),
		t("div", { id: "content", }, [
			block("Intro", [
				txt("Kaboom.js is a JavaScript game programming library that helps you make games fast and fun!"),
			]),
			block("Quick Start", [
				txt("Paste this code in an html file and you're good to go"),
				code(`
<script type="module">

// import kaboom lib
import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";

// initialize kaboom context
kaboom();

// add a piece of text at position (120, 80)
add([
    text("hello"),
    pos(120, 80),
]);

</script>

				`, "html"),
				txt(["It's recommended to code directly in browser with the Kaboom template on ", t("a", { href: "https://replit.com/@replit/Kaboom" }, "Replit.com")]),
				txt("Also can be used with NPM"),
				code(`
$ npm install kaboom
				`, "sh"),
				code(`
import kaboom from "kaboom";

kaboom();
				`),
			]),
			block("Init", [
				t("div", { class: "item", id: "kaboom", }, [
					t("div", { class: "name", }, renderNamedFunc(types["kaboom"])),
					...renderJSDoc(types["kaboom"]),
				]),
			]),
			...sections.map((sec) => block(sec.name, sec.entries.map((mem) => {
				if (!mem.name) {
					return;
				}
				const doc = mem.jsDoc?.[0];
				const items = [
				];
				return t("div", { id: mem.name, class: "item", }, [
					t("div", { class: "name", }, renderMember(mem)),
					...renderJSDoc(mem),
				]);
			}))),
			block("Types", entries.map((name) => {
				if (name === "kaboom") {
					return;
				}
				const mem = types[name];
				if (mem.kind === "ModuleDeclaration") {
					return;
				}
				return t("div", { class: "item", id: name, }, [
					t("div", { class: "name", }, name),
					...renderJSDoc(mem),
					name !== "KaboomCtx" && t("div", { class: "type", }, renderStmt(mem)),
				]);
			})),
		]),
		t("script", { src: "/site/js/doc.js", }, ""),
	]),
]);

module.exports = page;
