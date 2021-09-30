import View from "comps/View";
import Text from "comps/Text";

interface InputProps {
	value: string,
	onChange: (txt: string) => void,
	placeholder?: string,
}

const Input: React.FC<InputProps> = ({
	value,
	onChange,
	placeholder,
	...args
}) => (
	<input
		value={value}
		onChange={(e) => onChange(e.currentTarget.value)}
		placeholder={placeholder ?? ""}
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
