import { FontSize } from "comps/ui";

interface TextProps {
	color?: number,
	size?: FontSize,
	bold?: boolean,
}

const Text: React.FC<TextProps> = ({
	color,
	size,
	children,
	bold,
	...args
} = {
	color: 1,
	size: "normal",
}) => (
	<div
		css={{
			fontSize: `var(--text-${size ?? "normal"})`,
			color: `var(--color-fg${color ?? "1"})`,
			fontWeight: bold ? "bold" : "normal",
		}}
		{...args}
	>
		{children}
	</div>
);

export default Text;
