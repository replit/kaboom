import * as React from "react"
import { FontSize } from "lib/ui"

interface TextProps {
	color?: number | string,
	size?: FontSize,
	bold?: boolean,
	italic?: boolean,
	select?: boolean,
	code?: boolean,
	underline?: boolean,
}

type Props = TextProps & Omit<React.HTMLProps<HTMLSpanElement>, keyof TextProps>;

const Text: React.FC<Props> = (({
	color,
	size,
	bold,
	italic,
	children,
	select,
	code,
	underline,
	...props
}) => (
	<span
		css={{
			fontFamily: code ? "IBM PLex Mono" : "IBM Plex Sans",
			fontSize: `var(--text-${size ?? "normal"})`,
			fontWeight: bold ? "bold" : "normal",
			fontStyle: italic ? "italic" : "normal",
			textDecoration: underline ? "underline" : "none",
			color: color === undefined
				? "var(--color-fg1)"
				: typeof color === "number" ? `var(--color-fg${color})` : color,
			userSelect: select ? "text" : "none",
		}}
		{...props}
	>
		{children}
	</span>
))

export default Text
