init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

	const input = add([
		text("123abc", 24, { width: width(), }),
		origin("topleft"),
	]);

	charInput((ch) => {
		input.text += ch;
	});

	keyPressRep("enter", () => {
		input.text += "\n";
	});

	keyPressRep("backspace", () => {
		input.text = input.text.substring(0, input.text.length - 1);
	});

});

start("main");
