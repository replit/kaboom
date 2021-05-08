const fs = require("fs");
const ts = require("typescript");

const dest = "site/types.json";

const f = ts.createSourceFile(
	"types.ts",
	fs.readFileSync("src/types.ts", "utf-8"),
	ts.ScriptTarget.Latest,
	true
);

function transform(o, f) {
	for (const k in o) {
		if (o[k] == null) {
			continue;
		}
		const v = f(k, o[k]);
		if (v != null) {
			o[k] = v;
		} else {
			delete o[k];
		}
		if (typeof o[k] === "object") {
			transform(o[k], f);
		}
	}
	return o;
}

const stmts = transform(f.statements, (k, v) => {
	return (() => {
		switch (k) {
			case "pos":
			case "end":
			case "flags":
			case "parent":
			case "transformFlags":
			case "modifierFlagsCache": return;
			case "kind": return ts.SyntaxKind[v];
			case "name": return v.escapedText;
			case "typeName": return v.escapedText;
			case "questionToken": return true;
			default: return v;
		}
	})();
});

const doc = {
	types: {},
	funcs: {},
	interfaces: {},
};

stmts.filter((stmt) => {
	return stmt.modifiers && stmt.modifiers.some((mod) => {
		return mod.kind === "ExportKeyword";
	});
}).forEach((stmt) => {
	switch (stmt.kind) {
		case "TypeAliasDeclaration":
			doc.types[stmt.name] = stmt;
			break;
		case "FunctionDeclaration":
			doc.funcs[stmt.name] = stmt;
			break;
		case "InterfaceDeclaration":
			doc.interfaces[stmt.name] = stmt;
			break;
		default:
			console.warn(`unhandled stmt type: ${stmt.kind}`);
			break;
	}
});

fs.writeFileSync(dest, JSON.stringify(doc, null, 4));
console.log(`written to ${dest}`);
