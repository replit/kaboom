// yep

// @ts-ignore
import beanSrc from "./bean.png";

export default (k: KaboomCtx) => {

	function loadBean(name: string = "bean"): Promise<SpriteData> {
		return k.loadSprite(name, beanSrc);
	}

	return {
		loadBean,
	};

};
