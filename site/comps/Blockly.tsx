import {
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react"
import Blockly, { Workspace } from "blockly"
import { javascriptGenerator } from "blockly/javascript"
import "lib/kaboomBlockly"

export interface BlocklyEditorRef {
	genCode: () => string,
	save: () => any,
	load: (data: any) => void,
}

// https://developers.google.com/blockly/guides/configure/web/events
type WorkspaceEvent = {
	type: string
	isUiEvent: boolean
	workspaceId: string
	blockId: string
	group: string
}

const SAVE_EVENTS = new Set([
	Blockly.Events.BLOCK_CHANGE,
	Blockly.Events.BLOCK_CREATE,
	Blockly.Events.BLOCK_DELETE,
	Blockly.Events.BLOCK_MOVE,
	Blockly.Events.VAR_CREATE,
	Blockly.Events.VAR_DELETE,
	Blockly.Events.VAR_RENAME,
])

const specialBlocks: Record<string, any> = {}

specialBlocks["kaboom_pos"] = {
	inputs: {
		"X": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 0 },
			},
		},
		"Y": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 0 },
			},
		},
	},
}

specialBlocks["kaboom_rect"] = {
	inputs: {
		"WIDTH": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 40 },
			},
		},
		"HEIGHT": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 40 },
			},
		},
	},
}

specialBlocks["kaboom_text"] = {
	inputs: {
		"TEXT": {
			shadow: {
				type: "text",
				fields: { "TEXT": "" },
			},
		},
	},
}

specialBlocks["kaboom_moveBy"] = {
	inputs: {
		"X": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 0 },
			},
		},
		"Y": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 0 },
			},
		},
	},
}

specialBlocks["kaboom_moveTo"] = {
	inputs: {
		"X": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 0 },
			},
		},
		"Y": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 0 },
			},
		},
	},
}

specialBlocks["kaboom_scaleTo"] = {
	inputs: {
		"X": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 1 },
			},
		},
		"Y": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 1 },
			},
		},
	},
}

specialBlocks["kaboom_rotateTo"] = {
	inputs: {
		"ANGLE": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 0 },
			},
		},
	},
}

specialBlocks["kaboom_jump"] = {
	inputs: {
		"FORCE": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 640 },
			},
		},
	},
}

specialBlocks["kaboom_setText"] = {
	inputs: {
		"TEXT": {
			shadow: {
				type: "text",
				fields: { "TEXT": "" },
			},
		},
	},
}

specialBlocks["math_random_int"] = {
	inputs: {
		"FROM": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 0 },
			},
		},
		"TO": {
			shadow: {
				type: "math_number",
				fields: { "NUM": 10 },
			},
		},
	},
}

const blocks = [
	{
		name: "kaboom",
		blocks: [
			"kaboom_kaboom",
			"kaboom_burp",
			"kaboom_shake",
			"kaboom_gravity",
			"kaboom_loadSprite",
			"kaboom_loadSound",
			"kaboom_add",
			"kaboom_destroy",
			"kaboom_mouseX",
			"kaboom_mouseY",
			"kaboom_width",
			"kaboom_height",
			"kaboom_dt",
		],
	},
	{
		name: "components",
		blocks: [
			"kaboom_sprite",
			"kaboom_rect",
			"kaboom_text",
			"kaboom_pos",
			"kaboom_scale",
			"kaboom_rotate",
			"kaboom_color",
			"kaboom_color2",
			"kaboom_anchor",
			"kaboom_area",
			"kaboom_body",
			"kaboom_outline",
			"kaboom_offscreen",
		],
	},
	{
		name: "actions",
		blocks: [
			"kaboom_getPosX",
			"kaboom_getPosY",
			"kaboom_moveTo",
			"kaboom_moveBy",
			"kaboom_scaleTo",
			"kaboom_rotateTo",
			"kaboom_setText",
			"kaboom_jump",
			"kaboom_isGrounded",
		],
	},
	{
		name: "events",
		blocks: [
			"kaboom_loop",
			"kaboom_wait",
			"kaboom_onUpdate",
			"kaboom_onUpdateTag",
			"kaboom_onKey",
			"kaboom_onMouse",
			"kaboom_onObj",
			"kaboom_onCollide",
		],
	},
	{
		name: "logic",
		blocks: [
			"controls_if",
			"logic_boolean",
			"logic_compare",
			"logic_operation",
			"logic_negate",
			"logic_null",
			"logic_ternary",
		],
	},
	{
		name: "controls",
		blocks: [
			"controls_repeat",
			"controls_repeat_ext",
		],
	},
	{
		name: "math",
		blocks: [
			"math_number",
			"math_arithmetic",
			"math_trig",
			"math_constant",
			"math_number_property",
			"math_round",
			"math_on_list",
			"math_modulo",
			"math_constrain",
			"math_random_int",
			"math_random_float",
			"math_atan2",
		],
	},
	{
		name: "text",
		blocks: [
			"text",
			"text_multiline",
			"text_create_join_container",
			"text_length",
			"text_isEmpty",
			"text_indexOf",
			"text_charAt",
			"text_append",
			"text_print",
		],
	},
	{
		name: "variables",
		blocks: [
			"variables_get",
			"variables_set",
			"math_change",
		],
	},
	{
		name: "list",
		blocks: [
			"lists_create_with",
			"lists_create_empty",
			"lists_repeat",
			"lists_reverse",
			"lists_isEmpty",
			"lists_length",
			"lists_getIndex",
			"lists_setIndex",
		],
	},
	{
		name: "function",
		blocks: [
			"procedures_defnoreturn",
			"procedures_defreturn",
			"procedures_callnoreturn",
			"procedures_callreturn",
		],
	},
]

const BlocklyEditor = forwardRef<BlocklyEditorRef>(({...props}, ref) => {

	const divRef = useRef<HTMLDivElement | null>(null)
	const workspaceRef = useRef<Workspace | null>(null)

	useImperativeHandle(ref, () => ({
		genCode() {
			if (!workspaceRef.current) throw new Error("Blockly workspace not initialized")
			return javascriptGenerator.workspaceToCode(workspaceRef.current)
		},
		save() {
			if (!workspaceRef.current) throw new Error("Blockly workspace not initialized")
			return Blockly.serialization.workspaces.save(workspaceRef.current)
		},
		load(data) {
			if (!workspaceRef.current) throw new Error("Blockly workspace not initialized")
			Blockly.Events.disable()
			Blockly.serialization.workspaces.load(data, workspaceRef.current)
			Blockly.Events.enable()
		},
	}))

	useEffect(() => {
		if (!divRef.current) return
		const div = divRef.current
		Blockly.registry.unregister("theme", "kaboom")
		const workspace = Blockly.inject(div, {
			toolbox: {
				kind: "categoryToolbox",
				contents: blocks.map((c) => ({
					kind: "category",
					name: c.name,
					contents: c.blocks.map((b) => ({
						kind: "block",
						type: b,
						...(specialBlocks[b] ?? {}),
					})),
				})),
			},
			grid: {
				spacing: 16,
			},
			comments: true,
			move: {
				drag: true,
				scrollbars: true,
				wheel: true,
			},
			zoom: {
				controls: true,
				pinch: true,
				wheel: true,
			},
			trashcan: true,
			theme: {
				name: "kaboom",
				base: Blockly.Themes.Classic,
				fontStyle: {
					family: "IBM Plex Mono",
				},
				componentStyles: {
					toolboxBackgroundColour: "#eeeeee",
					toolboxForegroundColour: "#888888",
					flyoutBackgroundColour: "#eeeeee",
					flyoutForegroundColour: "#888888",
					flyoutOpacity: 0.5,
					insertionMarkerColour: "#fff",
					scrollbarOpacity: 0.5,
				},
			},
		})

		workspaceRef.current = workspace

		workspace.addChangeListener((e) => {
			if (SAVE_EVENTS.has(e.type)) {
				// TODO: auto save
			}
		})

		let toolboxVisible = true

		const keyDownHandler = (e: KeyboardEvent) => {
			if (e.key === "Tab") {
				e.preventDefault()
				toolboxVisible = !toolboxVisible
				workspace.getToolbox()?.setVisible(toolboxVisible)
			}
		}

		div.addEventListener("keydown", keyDownHandler)

		return () => {
			div.removeEventListener("keydown", keyDownHandler)
			workspace.dispose()
		}

	}, [])

	return (
		<div ref={divRef} {...props} />
	)

})

export default BlocklyEditor
