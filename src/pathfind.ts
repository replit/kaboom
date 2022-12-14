type PathFindOpt = {
	allowDiagonal?: boolean,
}

export default function findPath(
	map: (0 | 1)[][],
	start: [number, number],
	end: [number, number],
	opt: PathFindOpt = {},
): [number, number][] {
	if (map[start[1]][start[0]] === 1) {
		throw new Error("Path find can't start / end on obstacle.")
	}
	return []
}
