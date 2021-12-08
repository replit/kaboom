import * as React from "react";
import View from "comps/View";
import Head from "comps/Head";
import pedit from "lib/pedit";

const Test: React.FC = () => {
	const canvasRef = React.useRef(null);
	React.useEffect(() => {
		if (!canvasRef.current) return;
		const p = pedit({
			width: 64,
			height: 64,
			canvasWidth: 640,
			canvasHeight: 480,
			canvas: canvasRef.current,
			styles: {
				background: "var(--color-bg2)",
				border: "solid 2px var(--color-outline)",
				borderRadius: "4px",
			},
		});
		p.focus();
	}, []);
	return (
		<View align="center" justify="center" stretchX stretchY>
			<Head title="pedit" />
			<canvas ref={canvasRef} />
		</View>
	)
};

export default Test;
