const fs = require("fs");

function cmpSemVer(v1, v2) {

	const toVerArr = (v) => {
		const arr = [0, 0, 0];
		v
		  .split('.')
		  .map(Number)
		  .filter(n => typeof n === "number" && !isNaN(n))
		  .forEach((n, i) => arr[i] = n);
		return arr;
	};

	const segs1 = toVerArr(v1);
	const segs2 = toVerArr(v2);

	for (let i = 0; i < 3; i++) {
		if (segs2[i] > segs1[i]) {
			return v2;
		}
		if (segs1[i] > segs2[i]) {
			return v1;
		}
	}

	// they're the same
	return v1;

}

function versions() {
	const list = fs
		.readdirSync("lib")
		.filter(p => !p.startsWith("."))
		;
	const latest = list.reduce(cmpSemVer);
	return {
		list: list,
		latest: latest,
	};
}

module.exports = {
	cmpSemVer,
	versions,
};
