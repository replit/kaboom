import * as React from "react";

interface GameViewRef {
	run: (code?: string) => void,
}

interface GameViewProps {
	code?: string,
}

const GameView = React.forwardRef<GameViewRef, GameViewProps>(({
	code,
	...args
}, ref) => {

	const iframeRef = React.useRef<HTMLIFrameElement>(null);

	React.useImperativeHandle(ref, () => ({
		run(code?: string) {
			if (!iframeRef.current) return;
			if (code === undefined) {
				iframeRef.current.srcdoc += "";
			} else {
				iframeRef.current.srcdoc = code;
			}
		},
	}));

	return (
		<iframe
			ref={iframeRef}
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

});

export default GameView;
