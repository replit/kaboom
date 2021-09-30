import View, { ViewProps } from "comps/View";
import { keyframes } from '@emotion/react';

interface BackgroundProps {
	bg?: number | string,
}

const Background: React.FC<BackgroundProps & ViewProps> = ({
	bg,
	children,
	...args
}) => (
	<View
		stretch
		css={{
			background: `url(/public/img/pat.svg) repeat ${bg !== undefined ? (typeof bg === "number" ? `var(--color-bg${bg})` : bg) : "var(--color-bg1)"}`,
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
