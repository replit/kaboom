(() => {

const k = kaboom;

function initLevel(arr, conf = {}) {

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
				comps.push(k.pos(
					conf.pos.x + j * conf.width,
					conf.pos.y + i * conf.height
				));
				add(comps);
// 				if (arr[i - 1][j] === 0) {
// 					if (!surface[tile]) {
// 						surface[tile] = [];
// 					}
// 					surface[tile].push(k.vec2(j, i));
// 				}
			}
		});
	});

	return {
		arr: arr,
		getPos(p) {
			return k.vec2(
				conf.pos.x + p.x * conf.width,
				conf.pos.y + p.y * conf.height
			);
		},
		getRandSurface(tile) {
			return surface[tile][~~k.rand(surface[tile].length)].sub(vec2(0, 1));
		},
	};

}

k.initLevel = initLevel;

})();

