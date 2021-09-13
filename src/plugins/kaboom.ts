// explosion

// @ts-ignore
import kaSrc from "./ka.png";
// @ts-ignore
import boomSrc from "./boom.png";

interface BoomConf {
	/**
	 * Animation speed.
	 */
	speed?: number,
	/**
	 * Scale.
	 */
	scale?: number,
	/**
	 * Additional ka components.
	 */
	kaComps?: () => CompList<any>,
	/**
	 * Additional boom components.
	 */
	boomComps?: () => CompList<any>,
}

interface Kaboom {
	/**
	 * Remove kaboom.
	 */
	destroy(): void,
}

interface ExplodeComp extends Comp {
}

interface KaboomPlug {
	addKaboom(pos: Vec2, conf?: BoomConf): Kaboom,
}

export default (k: KaboomCtx) => {

	function explode(speed: number = 2, size: number = 1): ExplodeComp {
		let time = 0;
		return {
			id: "explode",
			require: [ "scale", ],
			update() {
				const s = Math.sin(time * speed) * size;
				if (s < 0) {
					k.destroy(this);
				}
				this.scale = k.vec2(s);
				time += k.dt();
			},
		};
	}

	let kaSprite = null;
	let boomSprite = null;

	k.loadSprite(null, kaSrc).then((spr) => kaSprite = spr);
	k.loadSprite(null, boomSrc).then((spr) => boomSprite = spr);

	function addKaboom(pos: Vec2, conf: BoomConf = {}): Kaboom {

		const speed = (conf.speed || 1) * 5;
		const scale = conf.scale || 1;

		const boom = k.add([
			k.pos(pos),
			k.sprite(boomSprite),
			k.scale(0),
			k.stay(),
			k.origin("center"),
			explode(speed, scale),
			...(conf.boomComps ?? (() => []))(),
		]);

		const ka = k.add([
			k.pos(pos),
			k.sprite(kaSprite),
			k.scale(0),
			k.stay(),
			k.origin("center"),
			k.timer(0.4 / speed, () => ka.use(explode(speed, scale))),
			...(conf.kaComps ?? (() => []))(),
		]);

		return {
			destroy() {
				k.destroy(ka);
				k.destroy(boom);
			},
		};

	}

	return {
		addKaboom,
	};

};
