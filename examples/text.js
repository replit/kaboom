kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	plugins: [ proggyPlugin, ],
});

loadRoot("/pub/examples/");
loadProggy();
loadFont("04b03", "fonts/04b03_6x8.png", 6, 8);
loadFont("CP437", "fonts/CP437_9x16.png", 9, 16, " ☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■");

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
