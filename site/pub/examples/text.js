loadFont("04b03", "/pub/img/04b03.png", 6, 8);

init({
	fullscreen: true,
	scale: 2,
});

scene("main", () => {

	const input = add([
		text("123abc", 72, { width: width(), font: "04b03", }),
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
