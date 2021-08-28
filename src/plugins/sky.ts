// animating sky background

// @ts-ignore
import cloudSrc from "./cloud.png";

interface SkyConf {
	/**
	 * speed of cloud movement
	 */
	speed?: number,
	/**
	 * speed of cloud generation
	 */
	spawnSpeed?: number,
	/**
	 * background color
	 */
	color?: Color,
	/**
	 * how much upper area to spawn clouds
	 */
	height?: number,
}

interface Sky {
	/**
	 * destroy and stop the sky
	 */
	destroy(): void,
}

export default (k: KaboomCtx) => {

	k.loadSprite("cloud", cloudSrc);

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

			const screenPos = k.vec2(k.width(), k.rand(0, height * k.height()));

			const cloud = k.add([
				k.sprite("cloud"),
				k.pos(screenPos),
				k.origin("left"),
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
