import * as React from "react"
import { cssVars } from "lib/ui"
import View, { ViewProps } from "comps/View"
import Ctx from "lib/Ctx"
import { themes } from "lib/ui"
import useUpdateEffect from "hooks/useUpdateEffect"

export interface GameViewRef {
	run: (code: string) => void,
	send: (msg: any, origin?: string) => void,
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
`

interface GameViewProps {
	code: string,
	onLoad?: () => void,
}

const GameView = React.forwardRef<GameViewRef, GameViewProps & ViewProps>(({
	code,
	onLoad,
	...args
}, ref) => {

	const iframeRef = React.useRef<HTMLIFrameElement>(null)
	const { theme } = React.useContext(Ctx)

	React.useImperativeHandle(ref, () => ({
		run(code: string, msg?: any) {
			if (!iframeRef.current) return
			const iframe = iframeRef.current
			iframe.srcdoc = wrapGame(code)
		},
		send(msg: any, origin: string = "*") {
			if (!iframeRef.current) return
			const iframe = iframeRef.current
			iframe.contentWindow?.postMessage(JSON.stringify(msg), origin)
		},
	}))

	useUpdateEffect(() => {
		if (!iframeRef.current) return
		const iframe = iframeRef.current
		iframe.srcdoc = wrapGame(code)
	}, [ code ])

	React.useEffect(() => {
		const body = iframeRef.current?.contentWindow?.document?.body
		if (body) {
			body.className = theme
		}
	}, [ theme ])

	return (
		<View rounded {...args}>
			<iframe
				ref={iframeRef}
				tabIndex={0}
				onLoad={onLoad}
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
	)

})

export default GameView
