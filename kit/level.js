(() => {

const k = kaboom;

function initLevel(arr, map) {
	arr.forEach((row, i) => {
		row.forEach((tile, j) => {
			if (map[tile]) {
				const comps = map[tile]();
				comps.push(k.pos(j * 11 - 11 * row.length / 2, (arr.length - i) * 11 - 11 * arr.length / 2));
				add(comps);
			}
		});
	});
}

k.initLevel = initLevel;

})();

