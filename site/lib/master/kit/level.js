(() => {

if (!kaboom) {
	console.error("oh no kaboom not found!");
}

const k = kaboom;

function addMap(arr, conf = {}) {

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
			return arr[0].length * conf.width;
		},
		height() {
			console.log(arr.length);
			console.log(arr[0].length);
			return arr.length * conf.height;
		},
	};

}

k.addMap = addMap;

})();

