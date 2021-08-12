// font 04b03

// @ts-ignore
import b04b03Src from "./04b03_6x8.png";

export default (k: KaboomCtx) => {

	function load04b03(name: string = "04b03"): Promise<FontData> {
		return k.loadFont(
			name,
			b04b03Src,
			6,
			8
		);
	}

	return {
		load04b03,
	};

};
