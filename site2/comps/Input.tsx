import View from "comps/View";
import Text from "comps/Text";

interface InputProps {
	placeholder?: string,
	onChange: (txt: string) => void,
}

const Input: React.FC<InputProps> = ({
	placeholder,
	onChange,
	...args
}) => (
	<input
		onChange={(e) => onChange(e.target.value)}
		placeholder={placeholder ?? "123"}
		css={{
			fontSize: "var(--text-normal)",
			userSelect: "none",
			background: "var(--color-bg3)",
			borderRadius: 8,
			border: "solid 2px var(--color-outline)",
			outline: "none",
			padding: 8,
			color: "var(--color-fg1)",
			"::placeholder": {
				color: "var(--color-fg3)",
			},
			":focus": {
				border: "solid 2px var(--color-highlight)",
			},
		}}
		{...args}
	/>
);

export default Input;
