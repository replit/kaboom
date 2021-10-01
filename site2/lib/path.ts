function basename(path: string): string | null {
	return path
		.split("/")
		.pop()
		?.split(".")
		.slice(0, -1)
		.join(".")
		|| null;
}

function extname(path: string): string | null {
	return path
		.split(".")
		.pop()
		|| null;
}

export {
	basename,
	extname,
};
