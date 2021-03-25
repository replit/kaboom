(() => {

if (!kaboom) {
	console.error("kaboom not found!");
}

const k = kaboom;

function addLevel(arr, conf = {}) {

	const objs = [];
	const pos = k.vec2(conf.pos);
	let longRow = 0;

	arr.forEach((row, i) => {

		if (typeof(row) === "string") {
			row = row.split("");
		}

		longRow = Math.max(row.length, longRow);

		row.forEach((tile, j) => {

			const comps = (() => {
				if (conf[tile]) {
					if (typeof(conf[tile]) === "function") {
						return conf[tile]();
					} else if (Array.isArray(conf[tile])) {
						return [...conf[tile]];
					}
				} else if (conf.any) {
					return conf.any(tile);
				}
			})();

			if (comps) {
				comps.push(k.pos(
					pos.x + j * conf.width,
					pos.y + i * conf.height
				));
				objs.push(add(comps));
			}

		});

	});

	return {
		getPos(...p) {
			p = vec2(...p);
			return k.vec2(
				pos.x + p.x * conf.width,
				pos.y + p.y * conf.height
			);
		},
		width() {
			return longRow * conf.width;
		},
		height() {
			return arr.length * conf.height;
		},
		destroy() {
			for (const obj of objs) {
				destroy(obj);
			}
		},
	};

}

// TODO: deprecate addMap
k.addMap = addLevel;
k.addLevel = addLevel;

})();
