// explosion

// @ts-ignore
import kaSrc from "./ka.png";
// @ts-ignore
import boomSrc from "./boom.png";

interface BoomConf {
	/**
	 * speed
	 */
	speed?: number,
}

export default (k: KaboomCtx) => {

	function addKaboom() {
		k.add([
			k.sprite("ka"),
		]);
		k.add([
			k.sprite("boom"),
		]);
	}

	return {
		addKaboom,
	};

};
