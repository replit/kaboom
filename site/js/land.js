const fun = document.querySelector("#fun");

const games = [
	"https://replit.com/@aMoniker/Gush",
	"https://lajbel.itch.io/dont-break-the-country",
	"https://lajbel.itch.io/monkeyrunps",
	"https://lajbel.itch.io/purple-egg",
	"https://freshjuices.itch.io/eggou",
	"https://replit.com/@SixBeeps/Super-Pong",
	"https://replit.com/@ritza/3d-space-shooter",
	"https://replit.com/@theNvN/Satoshi-Run",
	"https://swilliamsio.itch.io/triple-threat",
	"https://achtaitaipai.itch.io/dodog",
];

fun.addEventListener("click", () => {
	window.open(games[~~(Math.random() * games.length)]);
});
