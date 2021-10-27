kaboom();

const input = add([
	text("123abc", {
		width: width(),
		size: 74,
	}),
]);

// load custom font 8x8
loadFont("unscii", "fonts/unscii_8x8.png", 8, 8);

// list of built-in fonts ("o" at the end means the outlined version)
const fonts = [
	"apl386o",
	"apl386",
	"sinko",
	"sink",
	"unscii"
];

let curFont = 0;

// listen to text input
onCharInput((ch) => {
	input.text += ch;
});

// like keyPress() but will retrigger when key is being held (which is similar
// to text input behavior)
onKeyPressRep("enter", () => {
	input.text += "\n";
});

onKeyPressRep("backspace", () => {
	input.text = input.text.substring(0, input.text.length - 1);
});

onKeyPress("up", () => {
	curFont = Math.max(curFont - 1, 0);
	input.font = fonts[curFont];
});

onKeyPress("down", () => {
	curFont = Math.min(curFont + 1, fonts.length - 1);
	input.font = fonts[curFont];
});
