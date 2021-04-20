export default function genGame(code) {
	return `
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
			position: absolute;
		}
	</style>
</head>

<body>
	<div id="log"></div>
	<script src="/lib/dev/kaboom.js"></script>
	<script>
${code}
	</script>
</body>

</html>
	`;
}
