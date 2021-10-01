import * as React from "react";
import { cssVars } from "lib/ui";
import View, { ViewProps } from "comps/View";
import Ctx from "lib/Ctx";
import { themes, Theme } from "lib/ui";

export interface GameViewRef {
	run: (code?: string) => void,
}

interface GameViewProps {
	code?: string,
}

const GameView = React.forwardRef<GameViewRef, GameViewProps & ViewProps>(({
	code,
	...args
}, ref) => {

	const iframeRef = React.useRef<HTMLIFrameElement>(null);
	const { theme } = React.useContext(Ctx);

	const wrapGame = React.useCallback((code: string) => `
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
<body class="${theme}">
	<script src="/public/dist/kaboom.js"></script>
	<script>
${code}
	</script>
</body>
	`, [ theme, cssVars, ]);

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
		<View rounded {...args}>
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
