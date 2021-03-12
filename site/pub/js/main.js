const gameView = document.querySelector("#game-view");
const editor = document.querySelector("#editor");

function run() {
	gameView.srcdoc = `
<!DOCTYPE html>

<html>

<head>
	<title>kaboom</title>
	<meta charset="utf-8">
	<style>
		* {
			margin: 0;
		}
		html,
		body {
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
		canvas {
			display: block;
		}
	</style>
</head>

<body>
	<script>
	</script>
	<script src="/lib/master/kaboom.js"></script>
	<script>kaboom.import();</script>
	<script>
init({
	clearColor: rgba(0, 0, 0, 0),
	width: window.innerWidth,
	height: window.innerHeight,
});

loadSprite("boom", "/pub/img/boom.png", {
	sliceX: 5,
});

scene("main", () => {
${editor.value}
});

start("main");
	</script>
</body>

</html>
	`;
}

run();

