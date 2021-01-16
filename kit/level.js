(() => {

const k = kaboom;

function initLevel(arr, conf = {}) {

	const w = 11;
	const h = 11;
	const surface = {};

	arr.forEach((row, i) => {
		row.forEach((tile, j) => {
			if (conf[tile]) {
				let comps = [];
				if (typeof(conf[tile]) === "function") {
					comps = conf[tile]();
				} else if (Array.isArray(conf[tile])) {
					comps = [...conf[tile]];
				}
				comps.push(k.pos(j * w - w * row.length / 2, (arr.length - i) * h - h * arr.length / 2));
				add(comps);
				if (arr[i - 1][j] === 0) {
					if (!surface[tile]) {
						surface[tile] = [];
					}
					surface[tile].push(k.vec2(j, i));
				}
			}
		});
	});

	return {
		arr: arr,
		getPos(p) {
			return k.vec2(p.x * w - w * arr[0].length / 2, (arr.length - p.y) * h - h * arr.length / 2);
		},
		getRandSurface(tile) {
			return surface[tile][~~k.rand(surface[tile].length)].sub(vec2(0, 1));
		},
	};

}

k.initLevel = initLevel;

})();

