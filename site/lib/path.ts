export function basename(path: string): string | null {
	return path
		.split("/")
		.pop()
		?.split(".")
		.slice(0, -1)
		.join(".")
		|| null;
}

export function extname(path: string): string | null {
	return path
		.split(".")
		.pop()
		|| null;
}
