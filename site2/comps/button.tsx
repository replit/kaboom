interface ButtonProps {
	text: string,
	onClick: () => void,
}

const Button: React.FC<ButtonProps> = ({
	text,
	onClick,
	...args
}) => (
	<div
		onClick={() => onClick()}
		onKeyDown={(e) => e.key === "Enter" && onClick()}
		tabIndex={0}
		css={{
			background: "var(--color-bg3)",
			color: "var(--color-fg1)",
			padding: "4px 8px",
			border: "solid 2px var(--color-outline)",
			borderRadius: "8px",
			fontSize: "var(--text-normal)",
			cursor: "pointer",
			userSelect: "none",
			":hover": {
				background: "var(--color-bg4)",
			},
			":active": {
				background: "var(--color-outline)",
			},
		}}
		{...args}
	>
		{text}
	</div>
);

export default Button;
