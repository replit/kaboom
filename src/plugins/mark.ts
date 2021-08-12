// yep

// @ts-ignore
import markSrc from "./mark.png";

export default (k: KaboomCtx) => {

	function loadMark(name: string = "mark"): Promise<SpriteData> {
		return k.loadSprite(name, markSrc);
	}

	return {
		loadMark,
	};

};
