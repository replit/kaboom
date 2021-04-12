kaboom.global();

loadFont("04b03", "/pub/fonts/04b03_6x8.png", 6, 8);
loadFont("proggy", "/pub/fonts/proggy_7x13.png", 7, 13);
loadFont("CP437", "/pub/fonts/CP437_9x16.png", 9, 16, " ☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■");


init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

	const fonts = [
		"unscii",
		"04b03",
		"proggy",
		"CP437",
	];

	let curFont = 0;

	const input = add([
		text("123abc", 24, {
			width: width(),
			font: fonts[curFont],
		}),
	]);

	charInput((ch) => {
		input.text += ch;
		curFont = (curFont + 1) % fonts.length;
		input.font = fonts[curFont];
	});

	keyPressRep("enter", () => {
		input.text += "\n";
	});

	keyPressRep("backspace", () => {
		input.text = input.text.substring(0, input.text.length - 1);
	});

});

start("main");
