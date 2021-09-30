import View, { ViewProps } from "comps/View";
import { keyframes } from '@emotion/react';

interface BackgroundProps {
	pat?: number,
	bg?: number | string,
}

const Background: React.FC<BackgroundProps & ViewProps> = ({
	pat,
	bg,
	children,
	...args
}) => (
	<View
		stretch
		css={{
			background: `url(/public/img/pat${pat ?? 1}.svg) repeat ${bg !== undefined ? (typeof bg === "number" ? `var(--color-bg${bg})` : bg) : "#3d3acf"}`,
			animation: `${keyframes(`
				0% {
					background-position: 0 0;
				}
				100% {
					background-position: 96px 96px;
				}
			`)} 5s infinite linear`,
		}}
		{...args}
	>
		{children}
	</View>
);

export default Background;
