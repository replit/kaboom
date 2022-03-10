import * as React from "react"
import View from "comps/View"

interface ToggleProps {
	offIcon?: string,
	onIcon?: string,
	on?: boolean,
	big?: boolean,
	onChange?: (on: boolean) => void,
}

const Toggle: React.FC<ToggleProps> = ({
	on,
	big,
	offIcon,
	onIcon,
	onChange,
	...args
}) => {

	const stripWidth = 54
	const size = 32
	const [ isOn, setIsOn ] = React.useState(on ?? false)

	React.useEffect(() => {
		if (on != null) {
			setIsOn(on)
		}
	}, [on])

	return (
		<View
			dir="row"
			align="center"
			justify={isOn ? "end" : "start"}
			focusable
			bg={3}
			padX={0.5}
			outlined
			css={{
				width: stripWidth,
				height: size,
				borderRadius: size / 2,
				position: "relative",
				cursor: "pointer",
				":hover": {
					background: "var(--color-bg4)",
				},
				":active": {
					background: "var(--color-outline)",
				},
			}}
			onClick={() => {
				onChange && onChange(!isOn)
				setIsOn(!isOn)
			}}
			{...args}
		>
			<View
				width={size - 8}
				height={size - 8}
				css={{
					borderRadius: size / 2,
					background: "var(--color-bg1) no-repeat 50% 50%",
					...((onIcon || offIcon) ? {
						...(isOn ? {
							backgroundImage: `url(${onIcon})`,
						} : {
							backgroundImage: `url(${offIcon})`,
						}),
					} : {}),
					backgroundSize: "60% 60%",
				}}
			>
			</View>
		</View>
	)

}

export default Toggle
