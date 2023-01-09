import {
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react"
import Blockly, { WorkspaceSvg } from "blockly"
import { javascriptGenerator } from "blockly/javascript"

export interface BlocklyEditorRef {
	genCode: () => string,
}

Blockly.registry.unregister("theme", "kaboom")

const FONT_SIZE = 16
const ICON_SIZE = FONT_SIZE * 1.75

const theme = Blockly.Theme.defineTheme("kaboom", {
	base: Blockly.Themes.Classic,
	fontStyle: {
		"family": "IBM Plex Mono",
		"weight": "bold",
		"size": FONT_SIZE,
	},
})

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

javascriptGenerator["kaboom"] = (block) => {
	return ["kaboom()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["add"] = (block) => {
	return ["add()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["sprite"] = (block) => {
	return ["sprite()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["anchor"] = (block) => {
	return ["anchor()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

javascriptGenerator["rotate"] = (block) => {
	return ["rotate()", javascriptGenerator.ORDER_FUNCTION_CALL]
}

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
		const blocks = [
			"logic_boolean",
			"logic_compare",
			"logic_operation",
			"logic_negate",
			"logic_null",
			"logic_ternary",
			"controls_if",
			"controls_repeat_ext",
			"math_number",
			"math_arithmetic",
			"text",
			"text_print",
			"variables_get",
			"variables_set",
			"kaboom",
			"sprite",
			"color",
			"add",
			"anchor",
			"rotate",
		]
		const workspace = Blockly.inject(divRef.current, {
			toolbox: {
				kind: "flyoutToolbox",
				contents: blocks.map((b) => ({
					"kind": "block",
					"type": b,
				})),
			},
			trashcan: true,
			theme: theme,
		})
		workspaceRef.current = workspace
		return () => workspace.dispose()
	}, [])
	return (
		<div ref={divRef} {...props} />
	)
})

export default BlocklyEditor
