function cmpSemVer(v1, v2) {

	const toVerArr = (v) => {
		return v
			.split('.')
			.map(Number)
			.filter(n => typeof n === "number" && !isNaN(n));
	};

	const segs1 = toVerArr(v1);
	const segs2 = toVerArr(v2);

	if (segs1.length !== 3) {
		return v2;
	}

	if (segs2.length !== 3) {
		return v1;
	}

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

module.exports = {
	cmpSemVer,
};
