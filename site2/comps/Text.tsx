import * as React from "react";
import { FontSize } from "comps/ui";

interface TextProps {
	color?: number,
	size?: FontSize,
	bold?: boolean,
	italic?: boolean,
	noSelect?: boolean,
	onClick?: (e: MouseEvent) => void,
}

const Text = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TextProps>>(({
	color,
	size,
	bold,
	italic,
	onClick,
	children,
	noSelect,
	...props
}, ref) => (
	<div
		ref={ref}
		onClick={onClick}
		css={{
			fontSize: `var(--text-${size ?? "normal"})`,
			color: `var(--color-fg${color ?? "1"})`,
			fontWeight: bold ? "bold" : "normal",
			fontStyle: italic ? "italic" : "normal",
			userSelect: noSelect ? "none" : "normal",
		}}
		{...props}
	>
		{children}
	</div>
));

export default Text;
