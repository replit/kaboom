import importedTypes from "types.json"

const types = importedTypes as any;

export interface DocSection {
	name: string,
	entries: string[],
};

export type DocTypes = Record<string, any[]>;

export interface Doc {
	types: DocTypes,
	sections: DocSection[],
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

export {
	types,
	sections,
};
