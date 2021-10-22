import fs from "fs/promises";
import pathlib from "path";

interface WalkDir {
	path: string,
	files: string[],
	dirs: Record<string, WalkDir>,
}

// recursively walk a directory
export default async function walkdir(dir: string): Promise<WalkDir> {

	const list = await fs.readdir(dir);

	const map: WalkDir = {
		path: dir,
		files: [],
		dirs: {},
	};

	for (const entry of list) {
		if (entry.startsWith(".")) continue;
		const path = pathlib.join(dir, entry);
		const stat = await fs.stat(path);
		if (stat.isDirectory()) {
			map.dirs[entry] = await walkdir(path);
		} else {
			map.files.push(entry);
		}
	}

	return map;

}
