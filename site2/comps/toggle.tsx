import * as React from "react";

interface ToggleProps {
	offIcon?: string,
	onIcon?: string,
	on?: boolean,
	big?: boolean,
	onChange: (on: boolean) => void,
}

const Toggle: React.FC<ToggleProps> = ({
	on,
	big,
	offIcon,
	onIcon,
	onChange,
	...args
}) => {

	const stripWidth = 54;
	const size = 32;
	const [ isOn, setIsOn ] = React.useState(on ?? false);

	React.useEffect(() => {
		if (on != null) {
			setIsOn(on);
		}
	}, [on]);

	return (
		<div
			css={{
				border: "solid 2px var(--color-outline)",
				width: stripWidth,
				height: size,
				borderRadius: size / 2,
				background: "var(--color-bg3)",
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
				onChange(!isOn);
				setIsOn(!isOn);
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					onChange(!isOn);
					setIsOn(!isOn);
				}
			}}
			tabIndex={0}
			{...args}
		>
			<div
				css={{
					width: size - 4,
					height: size - 4,
					borderRadius: size / 2,
					border: "solid 4px var(--color-bg3)",
					position: "absolute",
					background: "var(--color-bg1) no-repeat 50% 50%",
					...((onIcon || offIcon) ? {
						...(isOn ? {
							backgroundImage: `url(${onIcon})`,
						} : {
							backgroundImage: `url(${offIcon})`,
						})
					} : {}),
					backgroundSize: "60% 60%",
					left: isOn ? stripWidth - size : 0,
				}}
			>
			</div>
		</div>
	);

};

export default Toggle;
