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
	"type": "add",
	"message0": "%1 add",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
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
			"name": "name",
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
			"name": "x",
			"value": 0,
		},
		{
			"type": "field_number",
			"name": "y",
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
			"name": "FIELDNAME",
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
			"name": "value",
			"options": [
				[ "topleft", "TOPLEFT" ],
				[ "top", "TOP" ],
				[ "topright", "TOPRIGHT" ],
				[ "left", "LEFT" ],
				[ "center", "CENTER" ],
				[ "right", "RIGHT" ],
				[ "botleft", "BOTLEFT" ],
				[ "bot", "BOT" ],
				[ "botright", "BOTRIGHT" ],
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
			"name": "angle",
			"angle": 0,
		},
	],
	"output": "Object",
	"colour": 200,
	"tooltip": "Component to set object's angle",
	"helpUrl": "https://kaboomjs.com#rotate",
}])

javascriptGenerator["kaboom"] = (block: BlockSvg) => {
	console.log(block)
	return "kaboom()"
}

javascriptGenerator["add"] = (block: BlockSvg) => {
	return ["add()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["sprite"] = (block: BlockSvg) => {
	return ["sprite()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["pos"] = (block: BlockSvg) => {
	return ["pos()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["color"] = (block: BlockSvg) => {
	return ["color()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["anchor"] = (block: BlockSvg) => {
	return ["anchor()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["rotate"] = (block: BlockSvg) => {
	return ["rotate()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

const blocks = [
	{
		name: "kaboom",
		blocks: [
			"kaboom",
			"sprite",
			"pos",
			"color",
			"add",
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

const BlocklyEditor = forwardRef(({...props}, ref) => {
	const divRef = useRef(null)
	const workspaceRef = useRef<WorkspaceSvg | null>(null)
	useImperativeHandle(ref, () => ({
		genCode() {
			if (!workspaceRef.current) throw new Error("Workspace not initialized")
			return javascriptGenerator.workspaceToCode(workspaceRef.current)
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
