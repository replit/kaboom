kaboom({
	fullscreen: true,
	scale: 2,
});

loadRoot("/pub/examples/");
// proggy is a default font
loadProggy();
// loadCGA();
// load04b03();
loadFont("04b03", "fonts/04b03_6x8.png", 6, 8);
loadFont("CP437", "fonts/CP437_9x16.png", 9, 16, CP437_CHARS);

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

// listen to text input
charInput((ch) => {
	input.text += ch;
	curFont = (curFont + 1) % fonts.length;
	input.font = fonts[curFont];
});

// like keyPress() but will retrigger when key is being held (which is similar
// to text input behavior)
keyPressRep("enter", () => {
	input.text += "\n";
});

keyPressRep("backspace", () => {
	input.text = input.text.substring(0, input.text.length - 1);
});
