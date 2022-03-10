import * as React from "react"
import View from "comps/View"
import Head from "comps/Head"
import Pedit from "lib/pedit"

const Page: React.FC = () => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null)
	React.useEffect(() => {
		if (!canvasRef.current) return
		const canvas = canvasRef.current
		const root = canvas.parentElement
		if (!root) return
		const getCSSVar = (name: string) =>
			getComputedStyle(document.documentElement).getPropertyValue(name)
		const p = new Pedit({
			width: 64,
			height: 64,
			canvasWidth: root.offsetWidth - 32,
			canvasHeight: root.offsetHeight - 32,
			canvas: canvas,
			theme: {
				outline: getCSSVar("--color-outline"),
				bg: getCSSVar("--color-bg2"),
			},
			styles: {
				background: "var(--color-bg2)",
				border: "solid 2px var(--color-outline)",
				borderRadius: "8px",
			},
		})
		p.focus()
	}, [])
	return (
		<View align="center" justify="center" stretchX stretchY>
			<Head title="pedit" />
			<canvas ref={canvasRef} />
		</View>
	)
}

export default Page
