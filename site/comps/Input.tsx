import * as React from "react"
import View from "comps/View"
import Text from "comps/Text"

interface InputProps {
	value?: string,
	onChange?: (txt: string) => void,
	placeholder?: string,
}

const Input: React.FC<InputProps> = ({
	value,
	onChange,
	placeholder,
	...args
}) => {
	const [ content, setContent ] = React.useState(value ?? "")
	return (
		<input
			value={content}
			onChange={(e) => {
				onChange && onChange(e.currentTarget.value)
				setContent(e.currentTarget.value)
			}}
			placeholder={placeholder ?? ""}
			css={{
				fontSize: "var(--text-normal)",
				userSelect: "auto",
				background: "var(--color-bg3)",
				borderRadius: 8,
				boxShadow: "0 0 0 2px var(--color-outline)",
				border: "none",
				padding: 8,
				width: "100%",
				color: "var(--color-fg1)",
				"::placeholder": {
					color: "var(--color-fg3)",
				},
				":focus": {
					boxShadow: "0 0 0 2px var(--color-highlight)",
				},
			}}
			{...args}
		/>
	)
}

export default Input
