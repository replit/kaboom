// TODO: be its own package

import Blockly, { Block, BlockSvg } from "blockly"
import { javascriptGenerator as js } from "blockly/javascript"

const ICON_SIZE = 24
const KEYS = [
	"space", "left", "right", "up", "down", "enter",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
	"escape", "backspace", "tab", "control", "alt", "meta",
	"-", "=", " ", "`", "[", "]", "\\", ";", "'", ",", ".", "/",
	"f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12",
]

const imgURL = (name: string) => `https://github.com/replit/kaboom/raw/master/sprites/${name}.png`
const img = (name: string) => new Blockly.FieldImage(imgURL(name), ICON_SIZE, ICON_SIZE)

function getVarName(block: BlockSvg, field: string) {
	const id = block.getFieldValue(field)
	for (const v of block.getVarModels()) {
		if (v.getId() === id) {
			return v.name
		}
	}
	return null
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

Blockly.Blocks["kaboom_burp"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("burp")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setColour(200)
		this.setTooltip("Burp")
		this.setHelpUrl("https://kaboomjs.com#burp")
	},
}

js["kaboom_burp"] = () => {
	return "burp()"
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

// TODO: mimic lists_create_with
Blockly.Blocks["kaboom_add"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("add")
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
	const comps = js.valueToCode(block, "COMPS", js.ORDER_ATOMIC)
	if (!comps) return ""
	return [`add(${comps})\n`, js.ORDER_FUNCTION_CALL]
}

// TODO: mimic lists_create_with
Blockly.Blocks["kaboom_addNoRet"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("add")
		this.appendValueInput("COMPS")
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Add a game object from a list of components")
		this.setHelpUrl("https://kaboomjs.com#add")
	},
}

js["kaboom_addNoRet"] = (block: BlockSvg) => {
	const comps = js.valueToCode(block, "COMPS", js.ORDER_ATOMIC)
	if (!comps) return ""
	return `add(${comps})\n`
}

const minusImage =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAw" +
    "MC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPS" +
    "JNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAw" +
    "IDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K"

const plusImage =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC" +
    "9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMT" +
    "ggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNz" +
    "FjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MW" +
    "MwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS" +
    "44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg=="

function getExtraBlockState(block: Block) {
	if (block.saveExtraState) {
		const state = block.saveExtraState()
		return state ? JSON.stringify(state) : ""
	} else if (block.mutationToDom) {
		const state = block.mutationToDom()
		return state ? Blockly.Xml.domToText(state) : ""
	}
	return ""
}

function mutateBlock(block: Block, action: () => void) {
	if (block.isInFlyout) return
	Blockly.Events.setGroup(true)
	const oldExtraState = getExtraBlockState(block)
	action()
	const newExtraState = getExtraBlockState(block)
	if (oldExtraState !== newExtraState) {
		Blockly.Events.fire(new Blockly.Events.BlockChange(
			block,
			"mutation",
			null,
			oldExtraState,
			newExtraState,
		))
	}
	Blockly.Events.setGroup(false)
}

type AddBlock = Block & {
	itemCount: number,
	hasOutput: boolean,
	addComp(): void,
	removeComp(): void,
	setHasOutput(has: boolean): void,
	updateShape(count: number): void,
}

Blockly.Blocks["kaboom_add2"] = {
	itemCount: 3,
	hasOutput: false,
	init(this: AddBlock) {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage(minusImage, 16, 16, undefined, () => {
				mutateBlock(this, () => this.removeComp())
			}))
			.appendField(new Blockly.FieldImage(plusImage, 16, 16, undefined, () => {
				mutateBlock(this, () => this.addComp())
			}))
			.appendField(new Blockly.FieldImage(imgURL("bag"), 16, 16, undefined, () => {
				mutateBlock(this, () => this.setHasOutput(!this.hasOutput))
			}))
			.appendField(img("bean"))
			.appendField("add")
		for (let i = 0; i < this.itemCount; i++) {
			this.appendValueInput(`COMP${i}`)
		}
		this.setColour(200)
		if (this.hasOutput) {
			this.setOutput(true, "Object")
		}
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Add a game object from a list of components")
		this.setHelpUrl("https://kaboomjs.com#add")
	},
	setHasOutput(this: AddBlock, has: boolean) {
		this.hasOutput = has
		if (this.hasOutput) {
			this.setOutput(true, "Object")
		} else {
			this.setOutput(false)
		}
	},
	removeComp(this: AddBlock) {
		if (this.itemCount <= 1) return
		this.itemCount--
		this.removeInput("COMP" + this.itemCount)
	},
	addComp(this: AddBlock) {
		this.appendValueInput("COMP" + this.itemCount)
		this.itemCount++
	},
	updateShape(this: AddBlock, targetCount: number) {
		while (this.itemCount < targetCount) this.addComp()
		while (this.itemCount > targetCount) this.removeComp()
	},
	mutationToDom(this: AddBlock) {
		const xml = Blockly.utils.xml.createElement("mutation")
		xml.setAttribute("itemCount", this.itemCount + "")
		xml.setAttribute("hasOutput", this.hasOutput + "")
		return xml
	},
	domToMutation(this: AddBlock, xml: Element) {
		const itemCount = xml.getAttribute("itemCount")
		if (itemCount) {
			this.updateShape(parseInt(itemCount, 10))
		}
		const hasOutput = xml.getAttribute("hasOutput")
		if (hasOutput) {
			this.updateShape(JSON.parse(hasOutput))
		}
	},
	saveExtraState(this: AddBlock) {
		return {
			"itemCount": this.itemCount,
			"hasOutput": this.hasOutput,
		}
	},
	loadExtraState(state: any) {
		this.updateShape(state["itemCount"])
		this.setHasOutput(state["hasOutput"])
	},
}

js["kaboom_add2"] = (block: AddBlock) => {
	const comps = [...Array(block.itemCount).keys()]
		.map((i) => js.valueToCode(block, `COMP${i}`, js.ORDER_ATOMIC))
		.filter((c) => c)
		.join(",")
	return [`add([${comps}])`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_destroy"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("destroy")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Remove a game object")
		this.setHelpUrl("https://kaboomjs.com#destroy")
	},
}

js["kaboom_destroy"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	return `destroy(${obj})\n`
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
		this.appendValueInput("WIDTH")
			.setCheck("Number")
		this.appendValueInput("HEIGHT")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render rectangle")
		this.setHelpUrl("https://kaboomjs.com#rect")
	},
}

js["kaboom_rect"] = (block: BlockSvg) => {
	const w = js.valueToCode(block, "WIDTH", js.ORDER_ATOMIC)
	const h = js.valueToCode(block, "HEIGHT", js.ORDER_ATOMIC)
	return [`rect(${w}, ${h})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_text"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("text")
		this.appendValueInput("TEXT")
			.setCheck("String")
		this.setInputsInline(true)
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render a text")
		this.setHelpUrl("https://kaboomjs.com#text")
	},
}

js["kaboom_text"] = (block: BlockSvg) => {
	const text = js.valueToCode(block, "TEXT", js.ORDER_ATOMIC)
	return [`text(${text})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_pos"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("pos")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_pos"] = (block: BlockSvg) => {
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
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

Blockly.Blocks["kaboom_color2"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("color")
			.appendField(new Blockly.FieldNumber(), "R")
			.appendField(new Blockly.FieldNumber(), "G")
			.appendField(new Blockly.FieldNumber(), "B")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set color")
		this.setHelpUrl("https://kaboomjs.com#color")
	},
}

js["kaboom_color2"] = (block: BlockSvg) => {
	const r = block.getFieldValue("R")
	const g = block.getFieldValue("G")
	const b = block.getFieldValue("B")
	return [`color(${r}, ${g}, ${b})`, js.ORDER_FUNCTION_CALL]
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
			.appendField("body static")
			.appendField(new Blockly.FieldCheckbox(), "STATIC")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object physics body")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_body"] = (block: BlockSvg) => {
	const solid = block.getFieldValue("STATIC").toLowerCase()
	return [`body({ isStatic: ${solid} })`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_outline"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("outline")
			.appendField(new Blockly.FieldNumber(1), "WIDTH")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object an outline")
		this.setHelpUrl("https://kaboomjs.com#outline")
	},
}

js["kaboom_outline"] = (block: BlockSvg) => {
	const width = block.getFieldValue("WIDTH")
	return [`outline(${width})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_offscreen"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("offscreen destroy")
			.appendField(new Blockly.FieldCheckbox(1), "DESTROY")
		this.setColour(200)
		this.setOutput(true, "Object")
		this.setTooltip("Component to define object behavior when offscreen")
		this.setHelpUrl("https://kaboomjs.com#offscreen")
	},
}

js["kaboom_offscreen"] = (block: BlockSvg) => {
	const destroy = block.getFieldValue("DESTROY").toLowerCase()
	return [`offscreen({ destroy: ${destroy} })`, js.ORDER_FUNCTION_CALL]
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
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
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
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return `${obj}.moveTo(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_scaleTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("scale")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
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
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return `${obj}.scaleTo(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_rotateTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("rotate")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
		this.appendValueInput("ANGLE")
		this.setInputsInline(true)
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Rotate an object to an angle")
		this.setHelpUrl("https://kaboomjs.com#rotate")
	},
}

js["kaboom_rotateTo"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const angle = js.valueToCode(block, "ANGLE", js.ORDER_ATOMIC)
	return `${obj}.rotateTo(${angle}})\n`
}

Blockly.Blocks["kaboom_setText"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("set text to")
		this.appendValueInput("TEXT")
			.setCheck("String")
		this.setInputsInline(true)
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Set text")
		this.setHelpUrl("https://kaboomjs.com#text")
	},
}

js["kaboom_setText"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const text = js.valueToCode(block, "TEXT", js.ORDER_ATOMIC)
	return `${obj}.text = ${text}\n`
}

Blockly.Blocks["kaboom_jump"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("jump")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("with force")
		this.appendValueInput("FORCE")
		this.setInputsInline(true)
		this.setColour(200)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Make an object jump (requires body)")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_jump"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const force = js.valueToCode(block, "FORCE", js.ORDER_ATOMIC)
	return `${obj}.jump(${force})\n`
}

Blockly.Blocks["kaboom_getPosX"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("x position")
		this.setOutput(true, "Number")
		this.setColour(200)
		this.setTooltip("Get object X position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_getPosX"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["0", js.ORDER_ATOMIC]
	return [`${obj}.pos.x`, js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_getPosY"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("y position")
		this.setOutput(true, "Number")
		this.setColour(200)
		this.setTooltip("Get object Y position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_getPosY"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["0", js.ORDER_ATOMIC]
	return [`${obj}.pos.y`, js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_isGrounded"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("is grounded")
		this.setOutput(true, "Boolean")
		this.setColour(200)
		this.setTooltip("If an object is currently grounded (requires body)")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_isGrounded"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["false", js.ORDER_FUNCTION_CALL]
	return [`${obj}.isGrounded()`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_mouseX"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("mouse x")
		this.setColour(200)
		this.setOutput(true, "Number")
		this.setTooltip("Get mouse x position")
		this.setHelpUrl("https://kaboomjs.com#mousePos")
	},
}

js["kaboom_mouseX"] = () => {
	return ["mousePos().x", js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_mouseY"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("mouse y")
		this.setColour(200)
		this.setOutput(true, "Number")
		this.setTooltip("Get mouse y position")
		this.setHelpUrl("https://kaboomjs.com#mousePos")
	},
}

js["kaboom_mouseY"] = () => {
	return ["mousePos().y", js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_width"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("width")
		this.setColour(200)
		this.setOutput(true, "Number")
		this.setTooltip("Get game width")
		this.setHelpUrl("https://kaboomjs.com#width")
	},
}

js["kaboom_width"] = () => {
	return ["width()", js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_height"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("height")
		this.setColour(200)
		this.setOutput(true, "Number")
		this.setTooltip("Get game height")
		this.setHelpUrl("https://kaboomjs.com#height")
	},
}

js["kaboom_height"] = () => {
	return ["height()", js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_gravity"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("set gravity to")
			.appendField(new Blockly.FieldNumber(), "VALUE")
		this.setColour(200)
		this.setTooltip("Set gravity")
		this.setHelpUrl("https://kaboomjs.com#gravity")
	},
}

js["kaboom_gravity"] = (block: BlockSvg) => {
	const value = block.getFieldValue("VALUE")
	return `gravity(${value})`
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
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `onUpdate(() => {${action}})`
}

Blockly.Blocks["kaboom_onUpdateTag"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("every frame for tag")
			.appendField(new Blockly.FieldTextInput(), "TAG")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip("Run something every frame for all objects with a tag")
		this.setHelpUrl("https://kaboomjs.com#onUpdate")
	},
}

js["kaboom_onUpdateTag"] = (block: BlockSvg) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const tag = block.getFieldValue("TAG")
	return `onUpdate("${tag}", (obj) => {${action}})`
}

Blockly.Blocks["kaboom_onKey"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("when key")
			.appendField(new Blockly.FieldDropdown(KEYS.map((k) => [k, k])), "KEY")
			.appendField("is")
			.appendField(new Blockly.FieldDropdown([
				[ "pressed", "onKeyPress" ],
				[ "held down", "onKeyDown" ],
				[ "released", "onKeyRelease" ],
			]), "EVENT")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip(() => `Run something when a key is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#onKeyPress")
	},
}

js["kaboom_onKey"] = (block: BlockSvg) => {
	const key = block.getFieldValue("KEY")
	const event = block.getFieldValue("EVENT")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `${event}("${key}", () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onMouse"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("when mouse is")
			.appendField(new Blockly.FieldDropdown([
				[ "pressed", "onMousePress" ],
				[ "held down", "onMouseDown" ],
				[ "released", "onMouseRelease" ],
			]), "EVENT")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip(() => `Run something when mouse is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#onMousePress")
	},
}

js["kaboom_onMouse"] = (block: BlockSvg) => {
	const event = block.getFieldValue("EVENT")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `${event}(() => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onObj"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("when")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("is")
			.appendField(new Blockly.FieldDropdown([
				[ "clicked", "onClick" ],
				[ "hovered", "onHover" ],
				[ "grounded", "onGround" ],
				[ "destroy", "onDestroy" ],
			]), "EVENT")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip(() => `Run something when object is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#area")
	},
}

js["kaboom_onObj"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const event = block.getFieldValue("EVENT")
	return `${obj}.${event}(() => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onCollide"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("when")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("collides with a")
			.appendField(new Blockly.FieldTextInput(), "TAG")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip("Run something when object is collided with another object with a tag")
		this.setHelpUrl("https://kaboomjs.com#area")
	},
}

js["kaboom_onCollide"] = (block: BlockSvg) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const tag = block.getFieldValue("TAG")
	return `${obj}.onCollide("${tag}", (obj) => {\n${action}\n})`
}

Blockly.Blocks["kaboom_loop"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("every")
			.appendField(new Blockly.FieldNumber(1), "TIME")
			.appendField("seconds")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip("Run something every n seconds")
		this.setHelpUrl("https://kaboomjs.com#loop")
	},
}

js["kaboom_loop"] = (block: BlockSvg) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const time = block.getFieldValue("TIME")
	return `loop(${time}, () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_wait"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("after")
			.appendField(new Blockly.FieldNumber(1), "TIME")
			.appendField("seconds")
		this.appendStatementInput("ACTION")
		this.setColour(200)
		this.setTooltip("Run something after n seconds")
		this.setHelpUrl("https://kaboomjs.com#wait")
	},
}

js["kaboom_wait"] = (block: BlockSvg) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const time = block.getFieldValue("TIME")
	return `wait(${time}, () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_shake"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("bean"))
			.appendField("shake")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setColour(200)
		this.setTooltip("Screen shake")
		this.setHelpUrl("https://kaboomjs.com#shake")
	},
}

js["kaboom_shake"] = () => {
	return "shake()"
}
