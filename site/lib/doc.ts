import importedTypes from "types.json"

const types = importedTypes as any;

export interface DocSection {
	name: string,
	entries: string[],
};

export type DocTypes = Record<string, any[]>;

const typerefs = [...new Set(Object.keys(types))];
const kmembers = types["KaboomCtx"][0].members;
const sections: DocSection[] = [];

sections.push({
	name: "Start",
	entries: ["kaboom"],
});

for (const mem of kmembers) {

	if (!types[mem.name]) {
		types[mem.name] = [];
	}

	types[mem.name].push(mem);

	const tags = mem.jsDoc?.tags ?? {};

	if (tags["section"]) {
		const section = {
			name: tags["section"][0],
			entries: [],
		};
		sections.push(section);
	}

	const curSection = sections[sections.length - 1];

	if (mem.name && !curSection.entries.includes(mem.name)) {
		curSection.entries.push(mem.name);
	}

}

function isDeprecated(entry: any): boolean {
	return Boolean(entry.jsDoc?.tags["deprecated"]);
}

function isType(entry: any): boolean {
	return entry.kind === "TypeAliasDeclaration" || entry.kind === "InterfaceDeclaration";
}

export {
	types,
	sections,
	typerefs,
	isDeprecated,
	isType,
};
