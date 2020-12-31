init();
loadSprite("guy", "guy.png");

scene("main", () => {
	const player = add([
		sprite("guy"),
		pos(0, 0),
	]);
// 	const score = add([
// 		text("oh hi"),
// 		pos(-100, 0),
// 	]);
	keyPress(" ", () => {
		destroy(player);
	});
});

start("main");

