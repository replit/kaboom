const fs = require("fs");
const ts = require("typescript");

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

const types = {};

stmts.forEach((stmt) => {
	if (stmt.kind === "TypeAliasDeclaration") {
		types[stmt.name] = stmt.type;
	}
});

const dest = "site/types.json";

fs.writeFileSync(dest, JSON.stringify(types, null, 4));
console.log(`written to ${dest}`);
