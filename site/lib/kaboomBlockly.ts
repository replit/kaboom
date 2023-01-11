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

Blockly.Blocks["kaboom"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("k"))
			.appendField("kaboom")
		this.setColour(250)
		this.setTooltip("Start a Kaboom game")
		this.setHelpUrl("https://kaboomjs.com#kaboom")
	},
}

js["kaboom"] = () => {
	return "kaboom()"
}

Blockly.Blocks["loadSprite"] = {
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

js["loadSprite"] = (block: BlockSvg) => {
	const name = block.getFieldValue("NAME")
	const source = block.getFieldValue("SOURCE")
	return `loadSprite("${name}", "${source}")`
}

Blockly.Blocks["add"] = {
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

js["add"] = (block: BlockSvg) => {
	const comps = js.valueToCode(block, "COMPS", js.ORDER_ADDITION)
	if (!comps) return ""
	return [`add(${comps})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["sprite"] = {
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

js["sprite"] = (block: BlockSvg) => {
	const name = block.getFieldValue("NAME")
	return [`sprite("${name}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["rect"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("rect")
			.appendField(new Blockly.FieldNumber(), "WIDTH")
			.appendField(new Blockly.FieldNumber(), "HEIGHT")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render rectangle")
		this.setHelpUrl("https://kaboomjs.com#rect")
	},
}

js["rect"] = (block: BlockSvg) => {
	const w = block.getFieldValue("WIDTH")
	const h = block.getFieldValue("HEIGHT")
	return [`rect(${w}, ${h})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["pos"] = {
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

js["pos"] = (block: BlockSvg) => {
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return [`pos(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["scale"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("scale")
			.appendField(new Blockly.FieldNumber(), "X")
			.appendField(new Blockly.FieldNumber(), "Y")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set scale")
		this.setHelpUrl("https://kaboomjs.com#scale")
	},
}

js["scale"] = (block: BlockSvg) => {
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return [`scale(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["rotate"] = {
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

js["rotate"] = (block: BlockSvg) => {
	const angle = block.getFieldValue("ANGLE")
	return [`rotate(${angle})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["color"] = {
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

js["color"] = (block: BlockSvg) => {
	const color = block.getFieldValue("COLOR")
	return [`color("${color}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["anchor"] = {
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

js["anchor"] = (block: BlockSvg) => {
	const anchor = block.getFieldValue("ANCHOR")
	return [`anchor("${anchor}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["area"] = {
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

js["area"] = () => {
	return ["area()", js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["body"] = {
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

js["body"] = () => {
	return ["body()", js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["moveBy"] = {
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

js["moveBy"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return `${obj}.moveBy(${x}, ${y})\n`
}

Blockly.Blocks["moveTo"] = {
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

js["moveTo"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return `${obj}.moveTo(${x}, ${y})\n`
}

Blockly.Blocks["onUpdate"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("run every frame")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip("Run something every frame")
		this.setHelpUrl("https://kaboomjs.com#onUpdate")
	},
}

js["onUpdate"] = (block: BlockSvg) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ADDITION)
	return `onUpdate(() => {${action}})`
}

Blockly.Blocks["onKeyPress"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("when key")
			.appendField(new Blockly.FieldTextInput(), "KEY")
			.appendField("is pressed, do")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip("Run something when a key is pressed")
		this.setHelpUrl("https://kaboomjs.com#onKeyPress")
	},
}

js["onKeyPress"] = (block: BlockSvg) => {
	const key = block.getFieldValue("KEY")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ADDITION)
	return `onKeyPress("${key}", () => {${action}})`
}
