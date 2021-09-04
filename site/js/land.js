const fun = document.querySelector("#fun");

const games = [
	"https://replit.com/@aMoniker/Gush",
	"https://lajbel.itch.io/dont-break-the-country",
	"https://lajbel.itch.io/monkeyrunps",
	"https://lajbel.itch.io/purple-egg",
	"https://freshjuices.itch.io/eggou",
];

fun.addEventListener("click", () => {
	window.open(games[~~(Math.random() * games.length)]);
});
