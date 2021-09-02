kaboom({
	font: "sink",
});

const input = add([
	text("123abc", {
		width: width(),
		size: 48,
	}),
]);

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
