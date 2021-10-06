import ts from "typescript";
// @ts-ignore
import dts from "!raw-loader!public/dist/kaboom.d.ts"

export interface DocSection {
	name: string,
	entries: string[],
};

export type DocTypes = Record<string, any[]>;

export interface Doc {
	types: DocTypes,
	sections: DocSection[],
}

function gen(dts: string): Doc {

	// stuff to hide from generated doc
	const hiddenTypes = new Set([
		"UnionToIntersection",
		"Defined",
		"Expand",
		"MergeObj",
		"MergeComps",
	]);

	const types: DocTypes = {};

	const f = ts.createSourceFile(
		"ts",
		dts,
		ts.ScriptTarget.Latest,
		true
	);

	function transform(o: any, f: (k: string, v: any) => any) {
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
			if (!types[stmt.name]) {
				types[stmt.name] = [];
			}
			types[stmt.name].push(stmt);
		}
	}

	const kmembers = types["KaboomCtx"][0].members;
	const sections: DocSection[] = [];
	let curSection: Array<any> = [];

	sections.push({
		name: "Start",
		entries: ["kaboom"],
	});

	for (const mem of kmembers) {
		if (!types[mem.name]) {
			types[mem.name] = [];
		}
		types[mem.name].push(mem);
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
		if (mem.name && !curSection.includes(mem.name)) {
			curSection.push(mem.name);
		}
	}

	return {
		types,
		sections,
	};

}

const { types, sections } = gen(dts);

export {
	types,
	sections,
	gen,
};
