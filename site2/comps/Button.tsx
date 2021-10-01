import View, { ViewProps } from "comps/View";
import Text from "comps/Text";

interface ButtonProps {
	text: string,
	action?: () => void,
}

const Button: React.FC<ButtonProps & ViewProps> = ({
	text,
	action,
	...args
}) => (
	<View
		focusable
		onClick={() => action && action()}
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
