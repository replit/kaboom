import * as React from "react";
import { FontSize } from "lib/ui";

interface TextProps {
	color?: number | string,
	size?: FontSize,
	bold?: boolean,
	italic?: boolean,
	select?: boolean,
}

const Text = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TextProps>>(({
	color,
	size,
	bold,
	italic,
	children,
	select,
	...props
}, ref) => (
	<div
		ref={ref}
		css={{
			fontSize: `var(--text-${size ?? "normal"})`,
			color: color === undefined
				? "var(--color-fg1)"
				: typeof color === "number" ? `var(--color-fg${color})` : color,
			fontWeight: bold ? "bold" : "normal",
			fontStyle: italic ? "italic" : "normal",
			userSelect: select ? "auto" : "none",
		}}
		{...props}
	>
		{children}
	</div>
));

export default Text;
