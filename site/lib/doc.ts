import importedTypes from "types.json"

const types = importedTypes as any;

export interface DocSection {
	name: string,
	entries: string[],
	deprecated: string[],
};

export type DocTypes = Record<string, any[]>;

const typerefs = [...new Set(Object.keys(types))];
const kmembers = types["KaboomCtx"][0].members;
const sections: DocSection[] = [];

sections.push({
	name: "Start",
	entries: ["kaboom"],
	deprecated: [],
});

for (const mem of kmembers) {

	if (!types[mem.name]) {
		types[mem.name] = [];
	}

	types[mem.name].push(mem);

	const tags = mem.jsDoc?.[0].tags ?? [];
	let deprecated = false;

	for (const tag of tags) {
		if (tag.tagName === "section") {
			const section = {
				name: tag.comment,
				entries: [],
				deprecated: [],
			};
			sections.push(section);
		} else if (tag.tagName === "deprecated") {
			deprecated = true;
		}
	}

	const curSection = sections[sections.length - 1];
	const dest = deprecated ? curSection.deprecated : curSection.entries;

	if (mem.name && !dest.includes(mem.name)) {
		dest.push(mem.name);
	}

}

function isDeprecated(entry: any): boolean {
	const tags = entry.jsDoc?.[0]?.tags ?? [];
	return tags.find((tag: any) => tag.tagName === "deprecated");
}

export {
	types,
	sections,
	typerefs,
	isDeprecated,
};
