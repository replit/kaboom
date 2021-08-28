// animating sky background

// @ts-ignore
import cloudSrc from "./cloud.png";

interface SkyConf {
	/**
	 * Speed of cloud movement.
	 */
	speed?: number,
	/**
	 * Speed of cloud generation.
	 */
	spawnSpeed?: number,
	/**
	 * Background color.
	 */
	color?: Color,
	/**
	 * How much upper area in pixels to spawn clouds.
	 */
	height?: number,
	/**
	 * Additional sky components.
	 */
	skyComps?: CompList<any>,
	/**
	 * Additional cloud components.
	 */
	cloudComps?: DynCompList<any>,
}

interface Sky {
	/**
	 * Remove the sky.
	 */
	destroy(): void,
}

export default (k: KaboomCtx) => {

	let cloudSprite = null;

	k.loadSprite(null, cloudSrc).then((spr) => cloudSprite = spr);

	function addSky(conf: SkyConf = {}): Sky {

		const speed = conf.speed || 240;
		const spawnSpeed = conf.spawnSpeed || 1;
		const height = conf.spawnSpeed || 0.4;

		const bg = k.add([
			k.rect(k.width(), k.height()),
			k.color(conf.color || k.rgb(0.5, 1, 1)),
			k.fixed(),
		]);

		let destroyed = false;

		function spawnCloud() {

			if (!cloudSprite) {
				throw new Error("failed to load cloud sprite");
				return;
			}

			const screenPos = k.vec2(k.width(), k.rand(0, height * k.height()));

			const cloud = k.add([
				k.sprite(cloudSprite),
				k.pos(screenPos),
				k.origin("left"),
				...k.getComps(conf.cloudComps),
			]);

			const cspeed = k.rand(speed - 100, speed + 100);

			cloud.action(() => {
				cloud.move(-speed, 0);
			});

			if (!destroyed) {
				k.wait(k.rand(1.5, 3), spawnCloud);
			}

		}

		spawnCloud();

		return {
			destroy() {
				k.destroy(bg);
			},
		};

	}

	return {
		addSky,
	};

};
