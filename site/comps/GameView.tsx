import * as React from "react";
import { cssVars } from "lib/ui";
import View, { ViewProps } from "comps/View";
import Ctx from "lib/Ctx";
import { themes } from "lib/ui";

export interface GameViewRef {
	run: (code?: string) => void,
}

const wrapGame = (code: string) => `
<!DOCTYPE html>
<head>
	<style>
		${cssVars}
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
		body {
			background: var(--color-bg2);
		}
		canvas {
			width: 100%;
			height: 100%;
			border: solid 2px var(--color-outline);
			border-radius: 8px;
		}
		canvas:focus {
			border: solid 2px var(--color-highlight);
		}
	</style>
</head>
<body>
	<script src="/dist/kaboom.js"></script>
	<script>
${code}
	</script>
</body>
`;

interface GameViewProps {
	code?: string,
}

const GameView = React.forwardRef<GameViewRef, GameViewProps & ViewProps>(({
	code,
	...args
}, ref) => {

	const iframeRef = React.useRef<HTMLIFrameElement>(null);
	const { theme } = React.useContext(Ctx);

	React.useImperativeHandle(ref, () => ({
		run(code?: string) {
			if (!iframeRef.current) return;
			const iframe = iframeRef.current;
			if (code === undefined) {
				iframe.srcdoc += "";
			} else {
				iframe.srcdoc = wrapGame(code);
			}
		},
	}));

	React.useEffect(() => {
		const body = iframeRef.current?.contentWindow?.document?.body;
		if (body) {
			body.className = theme;
		}
	}, [ theme ]);

	return (
		<View rounded {...args}>
			<iframe
				ref={iframeRef}
				tabIndex={0}
				css={{
					border: "none",
					background: "var(--background-bg2)",
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
