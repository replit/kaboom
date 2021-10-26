// explosion

import {
	CompList,
	Vec2,
	Comp,
	KaboomCtx,
} from "../types";

// @ts-ignore
import kaSrc from "./ka.png";
// @ts-ignore
import boomSrc from "./boom.png";

interface BoomOpt {
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
	addKaboom(pos: Vec2, opt?: BoomOpt): Kaboom,
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

	function addKaboom(pos: Vec2, opt: BoomOpt = {}): Kaboom {

		const speed = (opt.speed || 1) * 5;
		const scale = opt.scale || 1;

		const boom = k.add([
			k.pos(pos),
			k.sprite(boomSprite),
			k.scale(0),
			k.stay(),
			k.origin("center"),
			explode(speed, scale),
			...(opt.boomComps ?? (() => []))(),
		]);

		const ka = k.add([
			k.pos(pos),
			k.sprite(kaSprite),
			k.scale(0),
			k.stay(),
			k.origin("center"),
			k.timer(0.4 / speed, () => ka.use(explode(speed, scale))),
			...(opt.kaComps ?? (() => []))(),
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
