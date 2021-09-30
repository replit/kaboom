import * as React from "react";
import { FontSize } from "lib/ui";

interface TextProps {
	color?: number,
	size?: FontSize,
	bold?: boolean,
	italic?: boolean,
	noSelect?: boolean,
}

const Text = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TextProps>>(({
	color,
	size,
	bold,
	italic,
	children,
	noSelect,
	...props
}, ref) => (
	<div
		ref={ref}
		css={{
			fontSize: `var(--text-${size ?? "normal"})`,
			color: `var(--color-fg${color ?? "1"})`,
			fontWeight: bold ? "bold" : "normal",
			fontStyle: italic ? "italic" : "normal",
			userSelect: noSelect ? "none" : "auto",
		}}
		{...props}
	>
		{children}
	</div>
));

export default Text;
