init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

	const input = add([
		text("123abc", 8, { width: 120, }),
// 		pos(width() / 2, height() / 2),
		origin("topleft"),
	]);

	input.action(() => {
		input.pos = mousePos();
	});

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
