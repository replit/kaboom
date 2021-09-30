const spaceUnit = 8;

interface SpacerProps {
	space?: number,
}

const Spacer: React.FC<SpacerProps> = ({
	space,
	...args
} = {
	space: 0,
}) => {
	const size = (space ?? 0) * spaceUnit;
	return (
		<div
			css={{
				width: size,
				height: size,
			}}
			{...args}
		>
		</div>
	);
};

export default Spacer;
