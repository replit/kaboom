// TODO: be its own package

import Blockly, { Block, BlockSvg } from "blockly"
import { javascriptGenerator as js } from "blockly/javascript"

const ICON_SIZE = 24
const img = (name: string) => new Blockly.FieldImage(`https://github.com/replit/kaboom/raw/master/sprites/${name}.png`, ICON_SIZE, ICON_SIZE)

function getVarName(block: BlockSvg, field: string) {
	const id = block.getFieldValue(field)
	for (const v of block.getVarModels()) {
		if (v.getId() === id) {
			return v.name
		}
	}
	return null
}

function getFirstVar(block: BlockSvg) {
	return block.getVarModels()[0]?.name
}

Blockly.Blocks["kaboom_kaboom"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("k"))
			.appendField("kaboom")
		this.setColour(250)
		this.setTooltip("Start a Kaboom game")
		this.setHelpUrl("https://kaboomjs.com#kaboom")
	},
}

js["kaboom_kaboom"] = () => {
	return "kaboom()"
}

Blockly.Blocks["kaboom_loadSprite"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("load sprite")
			.appendField(new Blockly.FieldTextInput(), "NAME")
			.appendField("from")
			.appendField(new Blockly.FieldTextInput(), "SOURCE")
		this.setColour(200)
		this.setTooltip("Load a sprite from image")
		this.setHelpUrl("https://kaboomjs.com#loadSprite")
	},
}

js["kaboom_loadSprite"] = (block: BlockSvg) => {
	const name = block.getFieldValue("NAME")
	const source = block.getFieldValue("SOURCE")
	return `loadSprite("${name}", "${source}")`
}

Blockly.Blocks["kaboom_add"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("add")
		// TODO: this appears in a new line
		this.appendValueInput("COMPS")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Add a game object from a list of components")
		this.setHelpUrl("https://kaboomjs.com#add")
	},
}

js["kaboom_add"] = (block: BlockSvg) => {
	const comps = js.valueToCode(block, "COMPS", js.ORDER_ADDITION)
	if (!comps) return ""
	return [`add(${comps})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_sprite"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("sprite")
			.appendField(new Blockly.FieldTextInput(), "NAME")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render a sprite")
		this.setHelpUrl("https://kaboomjs.com#sprite")
	},
}

js["kaboom_sprite"] = (block: BlockSvg) => {
	const name = block.getFieldValue("NAME")
	return [`sprite("${name}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_rect"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("rect")
			.appendField(new Blockly.FieldNumber(40), "WIDTH")
			.appendField(new Blockly.FieldNumber(40), "HEIGHT")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render rectangle")
		this.setHelpUrl("https://kaboomjs.com#rect")
	},
}

js["kaboom_rect"] = (block: BlockSvg) => {
	const w = block.getFieldValue("WIDTH")
	const h = block.getFieldValue("HEIGHT")
	return [`rect(${w}, ${h})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_text"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("text")
			.appendField(new Blockly.FieldTextInput(), "TEXT")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render a text")
		this.setHelpUrl("https://kaboomjs.com#text")
	},
}

js["kaboom_text"] = (block: BlockSvg) => {
	const text = block.getFieldValue("TEXT")
	return [`text("${text}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_pos"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("pos")
			.appendField(new Blockly.FieldNumber(), "X")
			.appendField(new Blockly.FieldNumber(), "Y")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_pos"] = (block: BlockSvg) => {
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return [`pos(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_scale"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("scale")
			.appendField(new Blockly.FieldNumber(1), "X")
			.appendField(new Blockly.FieldNumber(1), "Y")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set scale")
		this.setHelpUrl("https://kaboomjs.com#scale")
	},
}

js["kaboom_scale"] = (block: BlockSvg) => {
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return [`scale(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_rotate"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("rotate")
			.appendField(new Blockly.FieldAngle(), "ANGLE")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set rotation")
		this.setHelpUrl("https://kaboomjs.com#rotate")
	},
}

js["kaboom_rotate"] = (block: BlockSvg) => {
	const angle = block.getFieldValue("ANGLE")
	return [`rotate(${angle})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_color"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("color")
			.appendField(new Blockly.FieldColour(), "COLOR")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set color")
		this.setHelpUrl("https://kaboomjs.com#color")
	},
}

js["kaboom_color"] = (block: BlockSvg) => {
	const color = block.getFieldValue("COLOR")
	return [`color("${color}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_anchor"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("anchor")
			.appendField(new Blockly.FieldDropdown([
				[ "topleft", "topleft" ],
				[ "top", "top" ],
				[ "topright", "topright" ],
				[ "left", "left" ],
				[ "center", "center" ],
				[ "right", "right" ],
				[ "botleft", "botleft" ],
				[ "bot", "bot" ],
				[ "botright", "botright" ],
			]), "ANCHOR")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set anchor point")
		this.setHelpUrl("https://kaboomjs.com#anchor")
	},
}

js["kaboom_anchor"] = (block: BlockSvg) => {
	const anchor = block.getFieldValue("ANCHOR")
	return [`anchor("${anchor}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_area"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("area")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object collider")
		this.setHelpUrl("https://kaboomjs.com#area")
	},
}

js["kaboom_area"] = () => {
	return ["area()", js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_body"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("body")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object physics body")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_body"] = () => {
	return ["body()", js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_moveBy"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("move")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("by")
			.appendField(new Blockly.FieldNumber(), "X")
			.appendField(new Blockly.FieldNumber(), "Y")
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Move an object")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_moveBy"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return `${obj}.moveBy(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_moveTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("move")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
			.appendField(new Blockly.FieldNumber(), "X")
			.appendField(new Blockly.FieldNumber(), "Y")
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Move an object to a position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_moveTo"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return `${obj}.moveTo(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_scaleTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("scale")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
			.appendField(new Blockly.FieldNumber(), "X")
			.appendField(new Blockly.FieldNumber(), "Y")
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Scale an object to a scale")
		this.setHelpUrl("https://kaboomjs.com#scale")
	},
}

js["kaboom_scaleTo"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return `${obj}.scaleTo(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_jump"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("jump")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("with force")
			.appendField(new Blockly.FieldNumber(640), "FORCE")
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Make an object jump (requires body)")
		this.setHelpUrl("https://kaboomjs.com#jump")
	},
}

js["kaboom_jump"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const force = block.getFieldValue("FORCE")
	return `${obj}.jump(${force})\n`
}

Blockly.Blocks["kaboom_onUpdate"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("every frame")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip("Run something every frame")
		this.setHelpUrl("https://kaboomjs.com#onUpdate")
	},
}

js["kaboom_onUpdate"] = (block: BlockSvg) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ADDITION)
	return `onUpdate(() => {${action}})`
}

Blockly.Blocks["kaboom_onKeyPress"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("when key")
			.appendField(new Blockly.FieldTextInput(), "KEY")
			.appendField("is pressed")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip("Run something when a key is pressed")
		this.setHelpUrl("https://kaboomjs.com#onKeyPress")
	},
}

js["kaboom_onKeyPress"] = (block: BlockSvg) => {
	const key = block.getFieldValue("KEY")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ADDITION)
	return `onKeyPress("${key}", () => {${action}})`
}
