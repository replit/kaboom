// TODO: be its own package

import Blockly, { Block } from "blockly"
import { javascriptGenerator as js } from "blockly/javascript"

const ICON_SIZE = 16
const KEYS = [
	"space", "left", "right", "up", "down", "enter",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
	"escape", "backspace", "tab", "control", "alt", "meta",
	"-", "=", " ", "`", "[", "]", "\\", ";", "'", ",", ".", "/",
	"f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12",
]

const img = (name: keyof typeof images, onClick?: () => void) => new Blockly.FieldImage(images[name], ICON_SIZE, ICON_SIZE, undefined, onClick)

const minusImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAwIDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K"

const plusImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNzFjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MWMwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg=="

const images = {
	heart: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAiCAYAAADcbsCGAAAAAXNSR0IArs4c6QAAASpJREFUWIXVmMEVgjAMhtM+B3AD796cyFF4jsJE3LizARvoSV/FJE3SBOp/g1d+PtKQNk2wgy7n61MyblnnVF4namDNcGvUAkX5oi/QmGKQFijM08W4BGwFKz2/4FqMl3VO3PPTMJLP3h53Ho4y3ppiRpw4KM63Cqf9WisY5ZetxpoXS4T5ZQB7rnGAHvCnVuNpGD9T4h1NFE4rb6i3yJzrQdmraEao78htb0Tlj0X/Fbme9AOnXTsj1XfkJDvaPaRa+I/Wss4Jhesl7zKArFmJFBUMclr3ih61RQc4OOdqAag2OFHLGQVWplg1chHTKwEDUPStHhHkPhT7KdUdvxZSEnmqWpjPSlrbxhoYAAP3VtROWVJbRcXXE1BT8MUDvU6ONDItW9bDQK1eux+SirvKsYAAAAAASUVORK5CYII=",
	bean: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA1CAYAAADyMeOEAAAAAXNSR0IArs4c6QAAAn5JREFUaIHdm7txAkEMhnUMBUAFEEPmcUgHhHRBQXThkA4IGTKIoQLoAEcw60PS6XkP/zNO7Nt/95O099hdV5Co2WTx9LS/PS5V1FhKhZt6QTlFBSHEJBOUkicAbugugEtZ4M3QUtjVbq32Pmz3quu14GpoCawFlJM0CFJ4FXQTcDQspqYASMDF0BxwG7B1UfBh0H0DLoXBN4E3QlPAXcOW0oKPOLMhAFPiqpOMxtCANXMczfTQgAF0Y/uIghWYe5R4gkX5Up6S+S2CxjrQvjVRPpS0/i9vNbQE2ALb5BnlLwVn797l4A7bfQgwNSju917fut7Q3C0+CpbzjAwoVkklH5lp6fy73s8h11jacX/nxj8C0H8TX+/n94+mjbYP63VU1bw40Uy3/TyuD9JaGVKxNzJK8+kS5tOluk3bopI39iz3SEEsAZJkm/LlKnU2WTxFmc4o9yZPSzVJfAGQ8qYaRYLXvaK8MR/sd6o5vdqt3QPMCqqm/djbgeSlQjog7jUywv8lE7SnQ42n9gtLKjd0prLeF0zP6aHrAzrj46Jv+veZxpI4vj0uVcQmXFsV4p3nt8elQjOtBWhzSkT0NQLI2/HvWlSAyDk99Bsat06W9pz++foO89qcjmFeAEWmPSXet00A12qop8SjsxOpP9BYtrue29rgSRb7w15OsBL3ZHtzOqLtI6bSB3R0tqnBR11fSrpPjd68PLuWmdNBux1E3ZxT9qejwa07pmpoAP9Zk+zNPq4P7hFsPnMiHRQ3sCxf90EbgG4OzHHighh6jgwg92ikRBEH5wCSjknW1bfzoekHYrPV6ingl7qEt34kDepkP0DMgkfqiklf/4fjF/Soc3nSQqqQAAAAAElFTkSuQmCC",
	k: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAzlJREFUeJztW8ttwzAMZYoOkA2Morcci27SETJXR+gmQY65FUU2yAbuxSoUWaQeJVIy0DygQOooovjEjz400QNjMO0P87Q/zKPHsRshNFX8ersMGQfRAAK4WR9FgrvQaX8gIqLr7cIqHzCChKceQhDlR8GdAE75r7f3VdsRJLkSEMw/RVB+CyS4W0BJodEkuBGwzD5k+rlnvfDs0alGeaGPuTYrpK53vV3Yti5pBw16KT7Op9UzlARO6dKii+1cw2Lyu6aZ50jIBdR4TJq4EZMgsgt0ukuJSX9T498pCfGALQJk3B8bA0BBM5fqLOGZFVzTYG1098wKmhjQxLqFErl4oJUpuRORMgbEAqTBWc5gTg7aP5JVsgRM+4NqDb9VlGafiIkBIbKPPKjoBSkLwLlfgtZVWkwelRuDzQKLC1R3jLRNv+faa4NhDpw1i2lwsYAqN0AHHdppybJCUbmajY3XYEtyJfmcBRR3g4sr7ChDAorvn+Pd/68vn3D7UlsEUjCvXgl6zXJKljcgAlpigQYWymsnBrYAi5QoIae8t/kTNW6GrNwAVd5jFaoiwGplGCtsqXzNhDRvh2ut4Pvn6D7zyISpCfDcH/Qy+xhqArZ6xVVriSoCvLfHOZf4OJ+qlEMttSkGeJgntxbwWnjBBLSYvjafa0loIQciQGv6FpbRaAlwoEZ2g2a3PEjaq0mNyNEXB9ECcgci6Owi7XKK5Z5xwZHDUoBVlE8kEMCdA/QASkIARzZCQpYAi9vdHDTB8PXls2kzhG7euAMRE+W/3t6b01ctCej1OlQfYJnvOYWCDJSwdEwc2aXT7ZULWC91teQh7dE+EV3uTKRW+dKAkFm1uiPQpkQTAlKgykjta9FEAJEvCT2gLbNZxYClcfxnNpAe0BJvUYWlrgP0hsYNqsrkkrTiEkditF6YSmsC8+Mty0MTSzfqRgCRDQkeMQQukPAQZHmtbgmXUlmiv+JGVTyQFLeuFQxwve/TuIKg/KoYU5AXPq7kdo0BMRASOOV71Cj1emcoS0LB1+GZb0G3KjDUb0NhdA/liTq9NIWit/JEnd8blKxghPJEG3hx8j8UY66wlfeGH3iA6Bc9b+qsgyPL1wAAAABJRU5ErkJggg==",
}


const colors = {
	kaboom: 250,
	obj: 250,
	component: 200,
	action: 180,
	loader: 320,
	query: 220,
	event: 130,
}

function getVarName(block: Block, field: string) {
	const id = block.getFieldValue(field)
	for (const v of block.getVarModels()) {
		if (v.getId() === id) {
			return v.name
		}
	}
	return null
}

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

Blockly.Blocks["kaboom_kaboom"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("k"))
			.appendField("kaboom")
		this.setColour(colors.kaboom)
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
			.appendField(img("heart"))
			.appendField("burp")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setColour(colors.action)
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
			.appendField(img("heart"))
			.appendField("load sprite")
			.appendField(new Blockly.FieldTextInput(), "NAME")
			.appendField("from")
			.appendField(new Blockly.FieldTextInput(), "SOURCE")
		this.setColour(colors.loader)
		this.setTooltip("Load a sprite from image")
		this.setHelpUrl("https://kaboomjs.com#loadSprite")
	},
}

js["kaboom_loadSprite"] = (block: Block) => {
	const name = block.getFieldValue("NAME")
	const source = block.getFieldValue("SOURCE")
	return `loadSprite("${name}", "${source}")`
}

Blockly.Blocks["kaboom_loadSound"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("load sound")
			.appendField(new Blockly.FieldTextInput(), "NAME")
			.appendField("from")
			.appendField(new Blockly.FieldTextInput(), "SOURCE")
		this.setColour(colors.loader)
		this.setTooltip("Load a sound")
		this.setHelpUrl("https://kaboomjs.com#loadSound")
	},
}

js["kaboom_loadSound"] = (block: Block) => {
	const name = block.getFieldValue("NAME")
	const source = block.getFieldValue("SOURCE")
	return `loadSound("${name}", "${source}")`
}

type AddBlock = Block & {
	itemCount: number,
	hasOutput: boolean,
	addComp(): void,
	removeComp(): void,
	setHasOutput(has: boolean): void,
	updateShape(count: number): void,
}

Blockly.Blocks["kaboom_add"] = {
	itemCount: 3,
	hasOutput: false,
	init(this: AddBlock) {
		this.appendDummyInput()
			.appendField(new Blockly.FieldImage(minusImage, 16, 16, "Remove a component field", () => {
				mutateBlock(this, () => this.removeComp())
			}))
			.appendField(new Blockly.FieldImage(plusImage, 16, 16, "Add a component field", () => {
				mutateBlock(this, () => this.addComp())
			}))
			.appendField(img("bean", () => {
				mutateBlock(this, () => this.setHasOutput(!this.hasOutput))
			}))
			.appendField("add")
		for (let i = 0; i < this.itemCount; i++) {
			this.appendValueInput(`COMP${i}`)
		}
		this.setColour(colors.obj)
		if (this.hasOutput) {
			this.setOutput(true, "Object")
		}
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Add a game object from a list of components")
		this.setHelpUrl("https://kaboomjs.com#add")
	},
	setHasOutput(this: AddBlock, has: boolean) {
		if (!has && this.getParent()) return
		this.hasOutput = has
		if (this.hasOutput) {
			this.setOutput(true, "Object")
		} else {
			this.setOutput(false)
		}
	},
	removeComp(this: AddBlock) {
		if (this.itemCount <= 1) return
		if (this.allInputsFilled()) return
		this.itemCount--
		this.removeInput(`COMP${this.itemCount}`)
	},
	addComp(this: AddBlock) {
		this.appendValueInput(`COMP${this.itemCount}`)
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
			this.updateShape(JSON.parse(hasOutput.toLowerCase()))
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

js["kaboom_add"] = (block: AddBlock) => {
	const comps = [...Array(block.itemCount).keys()]
		.map((i) => js.valueToCode(block, `COMP${i}`, js.ORDER_ATOMIC))
		.filter((c) => c)
		.join(",\n")
	const code = `add([\n${comps}\n])\n`
	return block.hasOutput ? [code, js.ORDER_FUNCTION_CALL] : code
}

Blockly.Blocks["kaboom_destroy"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("destroy")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
		this.setColour(colors.obj)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Remove a game object")
		this.setHelpUrl("https://kaboomjs.com#destroy")
	},
}

js["kaboom_destroy"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	return `destroy(${obj})\n`
}

Blockly.Blocks["kaboom_sprite"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("sprite")
			.appendField(new Blockly.FieldTextInput(), "NAME")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render a sprite")
		this.setHelpUrl("https://kaboomjs.com#sprite")
	},
}

js["kaboom_sprite"] = (block: Block) => {
	const name = block.getFieldValue("NAME")
	return [`sprite("${name}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_rect"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("rect")
		this.appendValueInput("WIDTH")
			.setCheck("Number")
		this.appendValueInput("HEIGHT")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render rectangle")
		this.setHelpUrl("https://kaboomjs.com#rect")
	},
}

js["kaboom_rect"] = (block: Block) => {
	const w = js.valueToCode(block, "WIDTH", js.ORDER_ATOMIC)
	const h = js.valueToCode(block, "HEIGHT", js.ORDER_ATOMIC)
	return [`rect(${w}, ${h})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_text"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("text")
		this.appendValueInput("TEXT")
			.setCheck("String")
		this.setInputsInline(true)
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to render a text")
		this.setHelpUrl("https://kaboomjs.com#text")
	},
}

js["kaboom_text"] = (block: Block) => {
	const text = js.valueToCode(block, "TEXT", js.ORDER_ATOMIC)
	return [`text(${text})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_pos"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("pos")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_pos"] = (block: Block) => {
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return [`pos(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_scale"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("scale")
			.appendField(new Blockly.FieldNumber(1), "X")
			.appendField(new Blockly.FieldNumber(1), "Y")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set scale")
		this.setHelpUrl("https://kaboomjs.com#scale")
	},
}

js["kaboom_scale"] = (block: Block) => {
	const x = block.getFieldValue("X")
	const y = block.getFieldValue("Y")
	return [`scale(${x}, ${y})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_rotate"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("rotate")
			.appendField(new Blockly.FieldAngle(), "ANGLE")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set rotation")
		this.setHelpUrl("https://kaboomjs.com#rotate")
	},
}

js["kaboom_rotate"] = (block: Block) => {
	const angle = block.getFieldValue("ANGLE")
	return [`rotate(${angle})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_color"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("color")
			.appendField(new Blockly.FieldColour(), "COLOR")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set color")
		this.setHelpUrl("https://kaboomjs.com#color")
	},
}

js["kaboom_color"] = (block: Block) => {
	const color = block.getFieldValue("COLOR")
	return [`color("${color}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_color2"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("color")
			.appendField(new Blockly.FieldNumber(), "R")
			.appendField(new Blockly.FieldNumber(), "G")
			.appendField(new Blockly.FieldNumber(), "B")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set color")
		this.setHelpUrl("https://kaboomjs.com#color")
	},
}

js["kaboom_color2"] = (block: Block) => {
	const r = block.getFieldValue("R")
	const g = block.getFieldValue("G")
	const b = block.getFieldValue("B")
	return [`color(${r}, ${g}, ${b})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_anchor"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
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
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to set anchor point")
		this.setHelpUrl("https://kaboomjs.com#anchor")
	},
}

js["kaboom_anchor"] = (block: Block) => {
	const anchor = block.getFieldValue("ANCHOR")
	return [`anchor("${anchor}")`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_area"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("area")
		this.setColour(colors.component)
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
			.appendField(img("heart"))
			.appendField("body static")
			.appendField(new Blockly.FieldCheckbox(), "STATIC")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object physics body")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_body"] = (block: Block) => {
	const solid = block.getFieldValue("STATIC").toLowerCase()
	return [`body({ isStatic: ${solid} })`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_outline"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("outline")
			.appendField(new Blockly.FieldNumber(1), "WIDTH")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to give object an outline")
		this.setHelpUrl("https://kaboomjs.com#outline")
	},
}

js["kaboom_outline"] = (block: Block) => {
	const width = block.getFieldValue("WIDTH")
	return [`outline(${width})`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_offscreen"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("offscreen destroy")
			.appendField(new Blockly.FieldCheckbox(1), "DESTROY")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to define object behavior when offscreen")
		this.setHelpUrl("https://kaboomjs.com#offscreen")
	},
}

js["kaboom_offscreen"] = (block: Block) => {
	const destroy = block.getFieldValue("DESTROY").toLowerCase()
	return [`offscreen({ destroy: ${destroy} })`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_fixed"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("fixed")
		this.setColour(colors.component)
		this.setOutput(true, "Object")
		this.setTooltip("Component to make object ignore camera")
		this.setHelpUrl("https://kaboomjs.com#fixed")
	},
}

js["kaboom_fixed"] = () => {
	return ["fixed()", js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_moveBy"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("move")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("by")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Move an object")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_moveBy"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return `${obj}.moveBy(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_moveTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("move")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Move an object to a position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_moveTo"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return `${obj}.moveTo(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_scaleTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("scale")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
		this.appendValueInput("X")
			.setCheck("Number")
		this.appendValueInput("Y")
			.setCheck("Number")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Scale an object to a scale")
		this.setHelpUrl("https://kaboomjs.com#scale")
	},
}

js["kaboom_scaleTo"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const x = js.valueToCode(block, "X", js.ORDER_ATOMIC)
	const y = js.valueToCode(block, "Y", js.ORDER_ATOMIC)
	return `${obj}.scaleTo(${x}, ${y})\n`
}

Blockly.Blocks["kaboom_rotateTo"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("rotate")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("to")
		this.appendValueInput("ANGLE")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Rotate an object to an angle")
		this.setHelpUrl("https://kaboomjs.com#rotate")
	},
}

js["kaboom_rotateTo"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const angle = js.valueToCode(block, "ANGLE", js.ORDER_ATOMIC)
	return `${obj}.rotateTo(${angle}})\n`
}

Blockly.Blocks["kaboom_setText"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("set text to")
		this.appendValueInput("TEXT")
			.setCheck("String")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Set text")
		this.setHelpUrl("https://kaboomjs.com#text")
	},
}

js["kaboom_setText"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const text = js.valueToCode(block, "TEXT", js.ORDER_ATOMIC)
	return `${obj}.text = ${text}\n`
}

Blockly.Blocks["kaboom_jump"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("jump")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("with force")
		this.appendValueInput("FORCE")
		this.setInputsInline(true)
		this.setColour(colors.action)
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setTooltip("Make an object jump (requires body)")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_jump"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const force = js.valueToCode(block, "FORCE", js.ORDER_ATOMIC)
	return `${obj}.jump(${force})\n`
}

Blockly.Blocks["kaboom_getPosX"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("x position")
		this.setOutput(true, "Number")
		this.setColour(colors.action)
		this.setTooltip("Get object X position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_getPosX"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["0", js.ORDER_ATOMIC]
	return [`${obj}.pos.x`, js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_getPosY"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("y position")
		this.setOutput(true, "Number")
		this.setColour(colors.action)
		this.setTooltip("Get object Y position")
		this.setHelpUrl("https://kaboomjs.com#pos")
	},
}

js["kaboom_getPosY"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["0", js.ORDER_ATOMIC]
	return [`${obj}.pos.y`, js.ORDER_MEMBER]
}

Blockly.Blocks["kaboom_isGrounded"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("is grounded")
		this.setOutput(true, "Boolean")
		this.setColour(colors.action)
		this.setTooltip("If an object is currently grounded (requires body)")
		this.setHelpUrl("https://kaboomjs.com#body")
	},
}

js["kaboom_isGrounded"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ["false", js.ORDER_FUNCTION_CALL]
	return [`${obj}.isGrounded()`, js.ORDER_FUNCTION_CALL]
}

Blockly.Blocks["kaboom_mouseX"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("mouse x")
		this.setColour(colors.query)
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
			.appendField(img("heart"))
			.appendField("mouse y")
		this.setColour(colors.query)
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
			.appendField(img("heart"))
			.appendField("width")
		this.setColour(colors.query)
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
			.appendField(img("heart"))
			.appendField("height")
		this.setColour(colors.query)
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
			.appendField(img("heart"))
			.appendField("set gravity to")
			.appendField(new Blockly.FieldNumber(), "VALUE")
		this.setColour(colors.query)
		this.setTooltip("Set gravity")
		this.setHelpUrl("https://kaboomjs.com#gravity")
	},
}

js["kaboom_gravity"] = (block: Block) => {
	const value = block.getFieldValue("VALUE")
	return `gravity(${value})`
}

Blockly.Blocks["kaboom_onUpdate"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("every frame")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something every frame")
		this.setHelpUrl("https://kaboomjs.com#onUpdate")
	},
}

js["kaboom_onUpdate"] = (block: Block) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `onUpdate(() => {${action}})`
}

Blockly.Blocks["kaboom_onUpdateTag"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("every frame for tag")
			.appendField(new Blockly.FieldTextInput(), "TAG")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something every frame for all objects with a tag")
		this.setHelpUrl("https://kaboomjs.com#onUpdate")
	},
}

js["kaboom_onUpdateTag"] = (block: Block) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const tag = block.getFieldValue("TAG")
	return `onUpdate("${tag}", (obj) => {${action}})`
}

Blockly.Blocks["kaboom_onKey"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("when key")
			.appendField(new Blockly.FieldDropdown(KEYS.map((k) => [k, k])), "KEY")
			.appendField("is")
			.appendField(new Blockly.FieldDropdown([
				[ "pressed", "onKeyPress" ],
				[ "held down", "onKeyDown" ],
				[ "released", "onKeyRelease" ],
			]), "EVENT")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip(() => `Run something when a key is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#onKeyPress")
	},
}

js["kaboom_onKey"] = (block: Block) => {
	const key = block.getFieldValue("KEY")
	const event = block.getFieldValue("EVENT")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `${event}("${key}", () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onMouse"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("when mouse is")
			.appendField(new Blockly.FieldDropdown([
				[ "pressed", "onMousePress" ],
				[ "held down", "onMouseDown" ],
				[ "released", "onMouseRelease" ],
			]), "EVENT")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip(() => `Run something when mouse is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#onMousePress")
	},
}

js["kaboom_onMouse"] = (block: Block) => {
	const event = block.getFieldValue("EVENT")
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	return `${event}(() => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onObj"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
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
		this.setColour(colors.event)
		this.setTooltip(() => `Run something when object is ${this.getField("EVENT")?.getText()}`)
		this.setHelpUrl("https://kaboomjs.com#area")
	},
}

js["kaboom_onObj"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const event = block.getFieldValue("EVENT")
	return `${obj}.${event}(() => {\n${action}\n})`
}

Blockly.Blocks["kaboom_onCollide"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("when")
			.appendField(new Blockly.FieldVariable("obj"), "OBJ")
			.appendField("collides with a")
			.appendField(new Blockly.FieldTextInput(), "TAG")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something when object is collided with another object with a tag")
		this.setHelpUrl("https://kaboomjs.com#area")
	},
}

js["kaboom_onCollide"] = (block: Block) => {
	const obj = getVarName(block, "OBJ")
	if (!obj) return ""
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const tag = block.getFieldValue("TAG")
	return `${obj}.onCollide("${tag}", (obj) => {\n${action}\n})`
}

Blockly.Blocks["kaboom_loop"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("every")
			.appendField(new Blockly.FieldNumber(1), "TIME")
			.appendField("seconds")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something every n seconds")
		this.setHelpUrl("https://kaboomjs.com#loop")
	},
}

js["kaboom_loop"] = (block: Block) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const time = block.getFieldValue("TIME")
	return `loop(${time}, () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_wait"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("after")
			.appendField(new Blockly.FieldNumber(1), "TIME")
			.appendField("seconds")
		this.appendStatementInput("ACTION")
		this.setColour(colors.event)
		this.setTooltip("Run something after n seconds")
		this.setHelpUrl("https://kaboomjs.com#wait")
	},
}

js["kaboom_wait"] = (block: Block) => {
	const action = js.statementToCode(block, "ACTION", js.ORDER_ATOMIC)
	const time = block.getFieldValue("TIME")
	return `wait(${time}, () => {\n${action}\n})`
}

Blockly.Blocks["kaboom_shake"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("shake")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setColour(colors.action)
		this.setTooltip("Screen shake")
		this.setHelpUrl("https://kaboomjs.com#shake")
	},
}

js["kaboom_shake"] = () => {
	return "shake()"
}

Blockly.Blocks["kaboom_play"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("play sound")
			.appendField(new Blockly.FieldTextInput(), "NAME")
		this.setPreviousStatement(true)
		this.setNextStatement(true)
		this.setColour(colors.action)
		this.setTooltip("Screen shake")
		this.setHelpUrl("https://kaboomjs.com#shake")
	},
}

js["kaboom_play"] = (block: Block) => {
	const name = block.getFieldValue("NAME")
	return `play(${name})`
}

Blockly.Blocks["kaboom_dt"] = {
	init(this: Block) {
		this.appendDummyInput()
			.appendField(img("heart"))
			.appendField("delta time")
		this.setOutput(true, "Number")
		this.setColour(colors.query)
		this.setTooltip("Delta time between frame")
		this.setHelpUrl("https://kaboomjs.com#dt")
	},
}

js["kaboom_dt"] = () => {
	return "dt()"
}
