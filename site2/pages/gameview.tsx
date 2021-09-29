interface GameViewProps {
	code?: string,
}

const GameView: React.FC<GameViewProps> = ({
	code,
	...args
}) => (
	<iframe
		css={{
			border: "none",
			background: "black",
		}}
		srcDoc={`
<!DOCTYPE html>
<head>
	<style>
		* {
			margin: 0;
			padding: 0;
		}
		body,
		html {
			width: 100%;
			height: 100%;
		}
	</style>
</head>
<body>
	<script src="/dist/kaboom.js"></script>
	<script>
${code}
	</script>
</body>
		`}
		{...args}
	/>
);

export default GameView;
