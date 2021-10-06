// @ts-ignore
import data from "lib/types";

export interface DocSection {
	name: string,
	entries: string[],
};

export interface Doc {
	types: Record<string, any>,
	entries: Record<string, any>,
	sections: DocSection[],
	data: any,
};

const members = data["KaboomCtx"].members;
const entries: Record<string, any> = {};
const types: Record<string, any> = {};
const sections: DocSection[] = [];
let curSection: Array<any> = [];

entries["kaboom"] = [data["kaboom"]];

sections.push({
	name: "Init",
	entries: ["kaboom"],
});

for (const mem of members) {
	if (!entries[mem.name]) {
		entries[mem.name] = [];
	}
	entries[mem.name].push(mem);
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
	entries,
	types,
	sections,
	data,
};
