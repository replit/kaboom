const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom();

loadSprite("bean", "sprites/bean.png");
	const bean = add([
		// list of components
		sprite("bean"),
		pos(80, 40),
		area(),
		body(),
	]);
// add platform
add([
	rect(width(), 48),
	pos(0, height() - 48),
	outline(4),
	area(),
	solid(),
	color(127, 200, 255),
])

// .jump() when "space" key is pressed
keyPress("space", () => {
    bean.jump()
})


add([
    rect(48, 64),
    area(),
    outline(4),
    pos(width(), height() - 48),
    origin("botleft"),
    color(255, 180, 255),
    move(LEFT, 240),
	"tree",
]);


bean.collides("tree", () => {
    addKaboom(bean.pos);
    shake();
});
