kaboom({
	background: [ 255, 209, 253 ]
});

loadSprite("bean", "sprites/bean.png");
loadSprite("mark", "sprites/spike.png");

const dialogues = [
	"hi my butterfly",
	"i love u",
	"you love me? pretty baby",
	"mark is a stupid",
	"he did not know how to take care of you...",
	"you don't know me ...",
	"what! mark???",
	"oh...hi"
];

const chars = [
	"bean",
	"bean",
	"bean",
	"bean",
	"bean",
	"mark",
	"bean",
	"mark"
];

let c = 0;

scene("say", (txt, ch) => {
	
	const textbox = add([
		rect(width() - 200, 120),
		origin("center"),
		pos(center().x, height() - 100),
		outline(4),
	]);

	textbox.radius = 40; // rounded

	add([
		sprite(ch),
		scale(3),
		origin("center"),
		pos(center().sub(0, 50))
	]);
	
	add([
		text(txt, { size: 30, width: width() - 230 }),
		pos(textbox.pos.sub(0, 10)),
		origin("center")
	]);

	keyPress("space", () => {
		if(c == dialogues.length - 1) c = 0;
		else c++;
		go("say", dialogues[c], chars[c]);
	});
});

go("say", dialogues[c], chars[c]);
