import {
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react"
import Blockly, { WorkspaceSvg, BlockSvg } from "blockly"
import { javascriptGenerator } from "blockly/javascript"

export interface BlocklyEditorRef {
	genCode: () => string,
	save: () => any,
	load: (data: any) => void,
}

const FONT_SIZE = 16
const ICON_SIZE = FONT_SIZE * 1.6

Blockly.defineBlocksWithJsonArray([{
	"type": "kaboom",
	"message0": "%1 kaboom",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/k.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
	],
	"colour": 250,
	"tooltip": "Start a Kaboom game",
	"helpUrl": "https://kaboomjs.com#kaboom",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "loadSprite",
	"message0": "%1 load sprite %2 from %3",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "field_input",
			"name": "NAME",
			"text": "bean",
			"spellcheck": false,
		},
		{
			"type": "field_input",
			"name": "SOURCE",
			"text": "sprites/bean.png",
			"spellcheck": false,
		},
	],
	"colour": 200,
	"tooltip": "Component to render a sprite",
	"helpUrl": "https://kaboomjs.com#sprite",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "add",
	"message0": "%1 add %2",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "input_value",
			"name": "COMPS",
		},
	],
	"output": "Object",
	"colour": 200,
	"tooltip": "Add a game object",
	"helpUrl": "https://kaboomjs.com#add",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "sprite",
	"message0": "%1 sprite %2",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "field_input",
			"name": "NAME",
			"text": "bean",
			"spellcheck": false,
		},
	],
	"output": "Object",
	"colour": 200,
	"tooltip": "Component to render a sprite",
	"helpUrl": "https://kaboomjs.com#sprite",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "pos",
	"message0": "%1 pos %2 %3",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "field_number",
			"name": "X",
			"value": 0,
		},
		{
			"type": "field_number",
			"name": "Y",
			"value": 0,
		},
	],
	"output": "Object",
	"colour": 200,
	"tooltip": "Component to set object position",
	"helpUrl": "https://kaboomjs.com#pos",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "color",
	"message0": "%1 color %2",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "field_colour",
			"name": "COLOR",
			"colour": "#ff4040",
		},
	],
	"output": "Object",
	"colour": 200,
	"tooltip": "Component to set object color",
	"helpUrl": "https://kaboomjs.com#color",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "anchor",
	"message0": "%1 anchor %2",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "field_dropdown",
			"name": "ANCHOR",
			"options": [
				[ "topleft", "topleft" ],
				[ "top", "top" ],
				[ "topright", "topright" ],
				[ "left", "left" ],
				[ "center", "center" ],
				[ "right", "right" ],
				[ "botleft", "botleft" ],
				[ "bot", "bot" ],
				[ "botright", "botright" ],
			],
		},
	],
	"output": "Object",
	"colour": 200,
	"tooltip": "Component to set object's anchor point",
	"helpUrl": "https://kaboomjs.com#anchor",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "rotate",
	"message0": "%1 rotate %2",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "field_angle",
			"name": "ANGLE",
			"angle": 0,
		},
	],
	"output": "Object",
	"colour": 200,
	"tooltip": "Component to set object's angle",
	"helpUrl": "https://kaboomjs.com#rotate",
}])

javascriptGenerator["kaboom"] = (block: BlockSvg) => {
	return "kaboom()"
}

javascriptGenerator["loadSprite"] = (block: BlockSvg) => {
	const name = block.getFieldValue("NAME")
	const source = block.getFieldValue("SOURCE")
	return `loadSprite("${name}", "${source}")`
}

javascriptGenerator["add"] = (block: BlockSvg) => {
	const comps = javascriptGenerator.valueToCode(block, "COMPS", javascriptGenerator.ORDER_ADDITION)
	if (!comps) {
		throw new Error("Failed to add()")
	}
	return [`add(${comps})`, javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["sprite"] = (block: BlockSvg) => {
	const name = block.getFieldValue("NAME")
	return [`sprite("${name}")`, javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["pos"] = (block: BlockSvg) => {
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return [`pos(${x}, ${y})`, javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["color"] = (block: BlockSvg) => {
	const color = block.getFieldValue("COLOR")
	return [`color("${color}")`, javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["anchor"] = (block: BlockSvg) => {
	const anchor = block.getFieldValue("ANCHOR")
	return [`anchor("${anchor}")`, javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["rotate"] = (block: BlockSvg) => {
	const angle = block.getFieldValue("ANGLE")
	return [`rotate(${angle})`, javascriptGenerator.ORDER_FUNCTION_CALL]
}

const blocks = [
	{
		name: "kaboom",
		blocks: [
			"kaboom",
			"loadSprite",
			"add",
			"sprite",
			"pos",
			"color",
			"anchor",
			"rotate",
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
	const divRef = useRef(null)
	const workspaceRef = useRef<WorkspaceSvg | null>(null)
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
			Blockly.serialization.workspaces.load(data, workspaceRef.current)
		},
	}))
	useEffect(() => {
		if (!divRef.current) return
		Blockly.registry.unregister("theme", "kaboom")
		const workspace = Blockly.inject(divRef.current, {
			toolbox: {
				kind: "categoryToolbox",
				contents: blocks.map((c) => ({
					kind: "category",
					name: c.name,
					contents: c.blocks.map((b) => ({
						kind: "block",
						type: b,
					})),
				})),
			},
			grid: {
				spacing: 16,
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
					weight: "bold",
					size: FONT_SIZE,
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
		return () => workspace.dispose()
	}, [])
	return (
		<div ref={divRef} {...props} />
	)
})

export default BlocklyEditor
