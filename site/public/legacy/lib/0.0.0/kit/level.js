(() => {

if (!kaboom) {
	console.error("oh no kaboom not found!");
}

const k = kaboom;

function addLevel(arr, conf = {}) {

	const objs = [];

	arr.forEach((row, i) => {
		if (typeof(row) === "string") {
			row = row.split("");
		}
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
				objs.push(add(comps));
			}
		});
	});

	return {
		arr: arr,
		getPos(...pos) {
			const p = vec2(...pos);
			return k.vec2(
				conf.pos.x + p.x * conf.width,
				conf.pos.y + p.y * conf.height
			);
		},
		width() {
			const longRow = arr.reduce((a, b) => {
				return a.length > b.length ? a.length : b.length;
			}, 0);
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

k.addMap = addLevel;
k.addLevel = addLevel;

})();

