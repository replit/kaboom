const ts = require("typescript");

// stuff to hide from generated doc
const hiddenTypes = new Set([
	"UnionToIntersection",
	"Defined",
	"Expand",
	"MergeObj",
	"MergeComps",
]);

function getTypes(dts) {

	const types = {};

	const f = ts.createSourceFile(
		".ts",
		dts,
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

	// transform and prune typescript ast to a format more meaningful to us
	const stmts = transform(f.statements, (k, v) => {
		switch (k) {
			case "pos":
			case "end":
			case "flags":
			case "parent":
			case "modifiers":
			case "transformFlags":
			case "modifierFlagsCache": return;
			case "name":
			case "typeName":
			case "tagName": return v.escapedText;
			case "kind": return ts.SyntaxKind[v];
			case "questionToken": return true;
			default: return v;
		}
	});

	for (const stmt of stmts) {
		if (!hiddenTypes.has(stmt.name)) {
			types[stmt.name] = stmt;
		}
	}

	return types;

}

module.exports = getTypes;
