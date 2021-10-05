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

const Text: React.FC<TextProps> = (({
	color,
	size,
	bold,
	italic,
	children,
	select,
	code,
	...props
}) => (
	<span
		css={{
			...(code ? {
				fontFamily: "IBM PLex Mono",
			}: {}),
			...(bold ? {
				fontWeight: "bold",
			}: {}),
			...(size ? {
				fontSize: `var(--text-${size})`,
			}: {}),
			...(italic ? {
				fontStyle: "italic",
			}: {}),
			...(color ? {
				color: typeof color === "number" ? `var(--color-fg${color})` : color,
			}: {}),
			...(select ? {
				userSelect: "text",
			}: {}),
		}}
		{...props}
	>
		{children}
	</span>
));

export default Text;
