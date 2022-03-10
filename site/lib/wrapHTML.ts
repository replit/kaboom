export default function wrapHTML(code: string) {
	return `
<!DOCTYPE html>
<head>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body,
		html {
			width: 100%;
			height: 100%;
		}
	</style>
</head>
<body>
	<script src="https://unpkg.com/kaboom@next/dist/kaboom.js"></script>
	<script>
${code}
	</script>
</body>
	`
}
