import * as React from "react";
import View, { ViewProps } from "comps/View";

export interface GameViewRef {
	run: (code?: string) => void,
}

interface GameViewProps {
	code?: string,
}

const wrapGame = (code: string) => `
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
	<script src="/public/dist/kaboom.js"></script>
	<script>
${code}
	</script>
</body>
`;

const GameView = React.forwardRef<GameViewRef, GameViewProps & ViewProps>(({
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
				iframeRef.current.srcdoc = wrapGame(code);
			}
		},
	}));

	return (
		<View outlined rounded {...args}>
			<iframe
				ref={iframeRef}
				tabIndex={0}
				css={{
					border: "none",
					background: "black",
					borderRadius: "8px",
					width: "100%",
					height: "100%",
				}}
				srcDoc={wrapGame(code ?? "")}
			/>
		</View>
	);

});

export default GameView;
