import * as React from "react";
import { FontSize } from "lib/ui";

interface TextProps {
	color?: number | string,
	size?: FontSize,
	bold?: boolean,
	italic?: boolean,
	select?: boolean,
	code?: boolean,
}

type Props = React.PropsWithChildren<
	TextProps
	& Omit<
		React.HTMLProps<HTMLDivElement>,
		keyof TextProps | "ref"
	>
>;

const Text = React.forwardRef<HTMLDivElement, Props>(({
	color,
	size,
	bold,
	italic,
	children,
	select,
	code,
	...props
}, ref) => (
	<div
		ref={ref}
		css={{
			fontFamily: code ? "IBM PLex Mono" : "IBM Plex Sans",
			fontSize: `var(--text-${size ?? "normal"})`,
			fontWeight: bold ? "bold" : "normal",
			fontStyle: italic ? "italic" : "normal",
			color: color === undefined
				? "var(--color-fg1)"
				: typeof color === "number" ? `var(--color-fg${color})` : color,
			userSelect: select ? "auto" : "none",
		}}
		{...props}
	>
		{children}
	</div>
));

export default Text;
