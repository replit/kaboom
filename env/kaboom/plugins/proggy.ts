// proggy font
// http://upperbounds.net/

// @ts-ignore
import proggySrc from "./proggy_7x13.png";

export default (k: KaboomCtx) => {

	function loadProggy(name: string = "proggy"): Promise<FontData> {
		return k.loadFont(
			name,
			proggySrc,
			7,
			13
		);
	}

	return {
		loadProggy,
	};

};
