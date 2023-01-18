import { ParsedUrlQuery } from "querystring"

export function getFirstQueries(query: ParsedUrlQuery) {
	const q: Record<string, string> = {}
	for (const name in query) {
		const value = query[name]
		if (typeof value === "string") {
			q[name] = value
		} else if (Array.isArray(value)) {
			q[name] = value[0]
		}
	}
	return q
}
