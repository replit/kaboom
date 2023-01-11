import Blockly, { BlockSvg } from "blockly"
import { javascriptGenerator as js } from "blockly/javascript"

const ICON_SIZE = 24

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
	"previousStatement": null,
	"nextStatement": null,
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

Blockly.defineBlocksWithJsonArray([{
	"type": "area",
	"message0": "%1 area",
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
	"tooltip": "Component to give object a collider",
	"helpUrl": "https://kaboomjs.com#area",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "body",
	"message0": "%1 body",
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
	"tooltip": "Component to give object a physics body",
	"helpUrl": "https://kaboomjs.com#body",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "rect",
	"message0": "%1 rect %2 %3",
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
			"name": "WIDTH",
			"value": 40,
		},
		{
			"type": "field_number",
			"name": "HEIGHT",
			"value": 40,
		},
	],
	"output": "Object",
	"colour": 200,
	"tooltip": "Component to render a rectangle",
	"helpUrl": "https://kaboomjs.com#body",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "moveBy",
	"message0": "%1 move %2 by %3 %4",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "field_variable",
			"name": "OBJ",
			"variable": "obj",
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
	"previousStatement": null,
	"nextStatement": null,
	"colour": 200,
	"tooltip": "Move an object",
	"helpUrl": "https://kaboomjs.com#pos",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "moveTo",
	"message0": "%1 move %2 to %3 %4",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "field_variable",
			"name": "OBJ",
			"variable": "obj",
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
	"previousStatement": null,
	"nextStatement": null,
	"colour": 200,
	"tooltip": "Move an object to a destination",
	"helpUrl": "https://kaboomjs.com#pos",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "onUpdate",
	"message0": "%1 run every frame %2",
	"args0": [
		{
			"type": "field_image",
			"src": "https://github.com/replit/kaboom/raw/master/sprites/bean.png",
			"width": ICON_SIZE,
			"height": ICON_SIZE,
			"alt": "*",
		},
		{
			"type": "input_statement",
			"name": "ACTION",
		},
	],
	"colour": 200,
	"tooltip": "Run something every frame",
	"helpUrl": "https://kaboomjs.com#onUpdate",
}])

Blockly.defineBlocksWithJsonArray([{
	"type": "onKeyPress",
	"message0": "%1 when key %2 is pressed, do %3",
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
			"name": "KEY",
		},
		{
			"type": "input_statement",
			"name": "ACTION",
		},
	],
	"colour": 200,
	"tooltip": "Define action when a key is pressed",
	"helpUrl": "https://kaboomjs.com#onKeyPress",
}])

js["kaboom"] = () => {
	return "kaboom()"
}

js["loadSprite"] = (block: BlockSvg) => {
	const name = block.getFieldValue("NAME")
	const source = block.getFieldValue("SOURCE")
	return `loadSprite("${name}", "${source}")`
}

js["add"] = (block: BlockSvg) => {
	const comps = js.valueToCode(block, "COMPS", js.ORDER_ADDITION)
	if (!comps) return ""
	return [`add(${comps})`, js.ORDER_FUNCTION_CALL]
}

js["sprite"] = (block: BlockSvg) => {
	const name = block.getFieldValue("NAME")
	return [`sprite("${name}")`, js.ORDER_FUNCTION_CALL]
}

js["pos"] = (block: BlockSvg) => {
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return [`pos(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

js["color"] = (block: BlockSvg) => {
	const color = block.getFieldValue("COLOR")
	return [`color("${color}")`, js.ORDER_FUNCTION_CALL]
}

js["anchor"] = (block: BlockSvg) => {
	const anchor = block.getFieldValue("ANCHOR")
	return [`anchor("${anchor}")`, js.ORDER_FUNCTION_CALL]
}

js["rotate"] = (block: BlockSvg) => {
	const angle = block.getFieldValue("ANGLE")
	return [`rotate(${angle})`, js.ORDER_FUNCTION_CALL]
}

js["area"] = () => {
	return ["area()", js.ORDER_FUNCTION_CALL]
}

js["body"] = () => {
	return ["body()", js.ORDER_FUNCTION_CALL]
}

js["rect"] = (block: BlockSvg) => {
	const w = block.getFieldValue("WIDTH")
	const h = block.getFieldValue("HEIGHT")
	return [`rect(${w}, ${h})`, js.ORDER_FUNCTION_CALL]
}

function getVarName(block: BlockSvg, field: string) {
	const id = block.getFieldValue(field)
	for (const v of block.getVarModels()) {
		if (v.getId() === id) {
			return v.name
		}
	}
	return null
}

js["moveBy"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return `${obj}.moveBy(${x}, ${y})\n`
}

js["moveTo"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return `${obj}.moveTo(${x}, ${y})\n`
}

js["onUpdate"] = (block: BlockSvg) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ADDITION)
	return `onUpdate(() => {${action}})`
}

js["onKeyPress"] = (block: BlockSvg) => {
	const key = block.getFieldValue("KEY")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ADDITION)
	return `onKeyPress("${key}", () => {${action}})`
}
