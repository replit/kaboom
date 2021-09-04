kaboom();

const input = add([
	text("123abc", {
		width: width(),
		size: 74,
	}),
]);

// list of built-in fonts ("o" at the end means the outlined version)
const fonts = [
	"apl386o",
	"apl386",
	"sinko",
	"sink",
];

let curFont = 0;

// listen to text input
charInput((ch) => {
	input.text += ch;
});

// like keyPress() but will retrigger when key is being held (which is similar
// to text input behavior)
keyPressRep("enter", () => {
	input.text += "\n";
});

keyPressRep("backspace", () => {
	input.text = input.text.substring(0, input.text.length - 1);
});

keyPress("up", () => {
	curFont = Math.max(curFont - 1, 0);
	input.font = fonts[curFont];
});

keyPress("down", () => {
	curFont = Math.min(curFont + 1, fonts.length - 1);
	input.font = fonts[curFont];
});
