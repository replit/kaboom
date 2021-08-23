type LevelConf = {
	width: number,
	height: number,
	pos?: Vec2,
	any(s: string): Comp[] | undefined,
	[sym: string]: any,
//  	[sym: string]: Comp[] | (() => Comp[]),
};

type Level = {
	getPos(p: Vec2): Vec2,
	spawn(sym: string, p: Vec2): GameObj<any>,
	width(): number,
	height(): number,
	gridWidth(): number,
	gridHeight(): number,
	offset(): Vec2,
	destroy(),
};

export default (k: KaboomCtx) => {

	function grid(level: Level, p: Vec2) {

		return {

			id: "grid",
			gridPos: p.clone(),

			setGridPos(p: Vec2) {
				this.gridPos = p.clone();
				this.pos = k.vec2(
					level.offset().x + this.gridPos.x * level.gridWidth(),
					level.offset().y + this.gridPos.y * level.gridHeight()
				);
			},

			moveLeft() {
				this.setGridPos(this.gridPos.add(k.vec2(-1, 0)));
			},

			moveRight() {
				this.setGridPos(this.gridPos.add(k.vec2(1, 0)));
			},

			moveUp() {
				this.setGridPos(this.gridPos.add(k.vec2(0, -1)));
			},

			moveDown() {
				this.setGridPos(this.gridPos.add(k.vec2(0, 1)));
			},

		};

	}

	function addLevel(map: string[], conf: LevelConf): Level {

		const objs: GameObj<any>[] = [];
		const offset = k.vec2(conf.pos || k.vec2(0));
		let longRow = 0;

		const level = {

			offset() {
				return offset.clone();
			},

			gridWidth() {
				return conf.width;
			},

			gridHeight() {
				return conf.height;
			},

			getPos(...args): Vec2 {
				// @ts-ignore
				const p = k.vec2(...args);
				return k.vec2(
					offset.x + p.x * conf.width,
					offset.y + p.y * conf.height
				);
			},

			spawn(sym: string, p: Vec2): GameObj<any> {

				const comps = (() => {
					if (Array.isArray(sym)) {
						return sym;
					} else if (conf[sym]) {
						if (typeof conf[sym] === "function") {
							return conf[sym]();
						} else if (Array.isArray(conf[sym])) {
							return [...conf[sym]];
						}
					} else if (conf.any) {
						return conf.any(sym);
					}
				})();

				if (!comps) {
					return;
				}

				comps.push(k.pos(
					offset.x + p.x * conf.width,
					offset.y + p.y * conf.height
				));

				const obj = k.add(comps);

				objs.push(obj);

				obj.use(grid(this, p));

				return obj;

			},

			width() {
				return longRow * conf.width;
			},

			height() {
				return map.length * conf.height;
			},

			destroy() {
				for (const obj of objs) {
					k.destroy(obj);
				}
			},

		};

		map.forEach((row, i) => {

			const syms = row.split("");

			longRow = Math.max(syms.length, longRow);

			syms.forEach((sym, j) => {
				level.spawn(sym, k.vec2(j, i));
			});

		});

		return level;

	}

	return {
		addLevel,
	};

};
