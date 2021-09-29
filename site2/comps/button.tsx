import View from "comps/view";
import Text from "comps/text";

interface ButtonProps {
	text: string,
	onClick: () => void,
}

const Button: React.FC<ButtonProps> = ({
	text,
	onClick,
	...args
}) => (
	<View
		focusable
		onClick={() => onClick()}
		onKeyDown={(e) => e.key === "Enter" && onClick()}
		bg={3}
		padX={1}
		padY={0.5}
		rounded
		outlined
		css={{
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
		<Text color={1}>{text}</Text>
	</View>
);

export default Button;
