// cga font
// https://int10h.org/oldschool-pc-fonts/fontlist/font?ibm_cga

// @ts-ignore
import cgaSrc from "./cga_8x8.png";

export default (k: KaboomCtx) => {

	function loadCGA(name: string = "cga"): Promise<FontData> {
		return k.loadFont(
			name,
			cgaSrc,
			8,
			8,
			k.CP437_CHARS,
		);
	}

	return {
		loadCGA,
	};

};
