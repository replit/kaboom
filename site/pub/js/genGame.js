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
		}
	</style>
</head>

<body>
	<script src="/lib/dev/kaboom.js"></script>
	<script src="/lib/dev/plugins/aseprite.js"></script>
	<script src="/lib/dev/plugins/pedit.js"></script>
	<script src="/lib/dev/plugins/04b03.js"></script>
	<script src="/lib/dev/plugins/cp437.js"></script>
	<script src="/lib/dev/plugins/proggy.js"></script>
	<script>
${code}
	</script>
</body>

</html>
	`;
}
