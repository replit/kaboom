import * as React from "react"
import { FontSize } from "lib/ui"

interface TextProps {
	color?: number | string,
	size?: FontSize,
	bold?: boolean,
	italic?: boolean,
	noselect?: boolean,
	code?: boolean,
	underline?: boolean,
	font?: string,
	align?: "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start",
}

type Props = TextProps & Omit<React.HTMLProps<HTMLSpanElement>, keyof TextProps>;

const Text: React.FC<Props> = (({
	color,
	size,
	bold,
	italic,
	children,
	noselect,
	code,
	underline,
	font,
	align,
	...props
}) => (
	<span
		css={{
			fontFamily: font ?? (code ? "IBM PLex Mono" : "IBM Plex Sans"),
			fontSize: `var(--text-${size ?? "normal"})`,
			fontWeight: bold ? "bold" : "normal",
			fontStyle: italic ? "italic" : "normal",
			textDecoration: underline ? "underline" : "none",
			textAlign: align,
			color: color === undefined
				? "var(--color-fg1)"
				: typeof color === "number" ? `var(--color-fg${color})` : color,
			userSelect: noselect ? "none" : "text",
		}}
		{...props}
	>
		{children}
	</span>
))

export default Text
