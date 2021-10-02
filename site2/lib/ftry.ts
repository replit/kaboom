export default function ftry<T>(f: () => T, def: T): T {
	try {
		return f();
	} catch (err) {
		return def;
	}
}
