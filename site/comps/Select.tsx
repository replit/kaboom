import * as React from "react"
import View, { ViewProps } from "comps/View"
import Text from "comps/Text"
import useClickOutside from "hooks/useClickOutside"
import useKey from "hooks/useKey"

interface PromptProps {
	name: string,
	expanded: boolean,
	options: string[],
}

const Prompt: React.FC<PromptProps> = ({
	expanded,
	options,
	name,
}) => {

	const longest = React.useMemo(
		() => options.reduce((a, b) => a.length > b.length ? a : b),
		[ options ],
	)

	return (
		<View
			dir="row"
			stretchX
			gap={1}
			justify="between"
		>
			<View padX={1} padY={0.5}>
				<Text css={{ opacity: "0" }}>{longest}</Text>
				<Text css={{ position: "absolute" }}>{name}</Text>
			</View>
			<View
				align="center"
				justify="center"
				width={32}
				height={35}
				bg={4}
				css={{
					borderTopRightRadius: 6,
					borderBottomRightRadius: expanded ? 0 : 6,
				}}
			>
				<Text
					color={3}
					css={{
						position: "relative",
						left: expanded ? -1 : 2,
						top: expanded ? 0 : 2,
						transform: `rotate(${expanded ? -90 : 90}deg) scaleY(1.2)`,
					}}
				>
					{">"}
				</Text>
			</View>
		</View>
	)
}

interface SelectProps {
	options: string[],
	value?: string,
	maxHeight?: number | string,
	onChange?: (item: string) => void,
}

// TODO: scroll to cur at expand
// TODO: jump with key
const Select: React.FC<SelectProps & ViewProps> = ({
	options,
	value,
	maxHeight,
	onChange,
	...args
}) => {

	const dropdownRef = React.useRef<HTMLDivElement>(null)
	const [ curItem, setCurItem ] = React.useState(value ?? options[0])
	const [ expanded, setExpanded ] = React.useState(false)

	useClickOutside(dropdownRef, () => setExpanded(false), [ setExpanded ])
	useKey("Escape", () => setExpanded(false), [ setExpanded ])

	React.useEffect(() => {
		if (!dropdownRef.current) return
		const dropdown = dropdownRef.current
		if (expanded) {
			dropdown.focus()
			const selected = dropdown.querySelector(".selected") as HTMLElement
			if (selected) {
				dropdown.scrollTop = selected.offsetTop
			}
		}
	}, [ expanded ])

	React.useEffect(() => {
		if (value != null) {
			setCurItem(value)
		}
	}, [ value ])

	return (
		<View
			dir="column"
			focusable
			rounded
			outlined
			bg={3}
			css={{
				cursor: "pointer",
				userSelect: "none",
				position: "relative",
				":hover": {
					...(!expanded ? {
						background: "var(--color-bg4)",
					} : {}),
				},
			}}
			onClick={() => setExpanded(!expanded)}
			{...args}
		>
			<Prompt name={curItem} options={options} expanded={expanded} />
			{expanded && <View
				dir="column"
				bg={3}
				stretchX
				outlined
				rounded
				css={{
					overflow: "hidden",
					position: "absolute",
					borderColor: "var(--color-highlight)",
					zIndex: 1000,
				}}
			>
				<Prompt name={curItem} options={options} expanded={expanded} />
				<View height={2} stretchX bg={4} />
				<View
// 					focusable
					ref={dropdownRef}
					stretchX
					bg={2}
					onKeyDown={(e) => {
						// TODO
						console.log(e.key)
					}}
					css={{
						overflowY: "auto",
						maxHeight: maxHeight ?? 480,
					}}
				>
					{options.map((opt) => (
						<View
							stretchX
							key={opt}
							padX={1.5}
							padY={1}
							className={curItem === opt ? "selected" : undefined}
							bg={curItem === opt ? 4 : "none"}
							focusable
							css={{
								":hover": {
									background: "var(--color-highlight)",
									"> *": {
										color: "var(--color-fghl) !important",
									},
								},
							}}
							onClick={() => {
								setCurItem(opt)
								onChange && onChange(opt)
							}}
						>
							<Text>{opt}</Text>
						</View>
					))}
				</View>
			</View>}
		</View>
	)

}

export default Select
