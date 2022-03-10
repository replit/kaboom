// TODO: don't use document.style.cursor
// TODO: custom key mod
// TODO: custom style
// TODO: custom state for each rule?

import {
	EditorView,
	ViewPlugin,
	PluginValue,
	DecorationSet,
	Decoration,
} from "@codemirror/view"

import {
	StateEffect,
	Facet,
} from "@codemirror/state"

type Target = {
	pos: number,
	text: string,
	rule: InteractRule,
}

export type InteractRule = {
	regexp: RegExp,
	cursor?: string,
	style?: any,
	onClick?: (text: string, setText: (t: string) => void, e: MouseEvent) => void,
	onDrag?: (text: string, setText: (t: string) => void, e: MouseEvent) => void,
}

const mark = Decoration.mark({ class: "cm-interact" })
const setInteract = StateEffect.define<Target | null>()

const interactTheme = EditorView.theme({
	".cm-interact": {
		background: "rgba(128, 128, 255, 0.2)",
		borderRadius: "4px",
	},
})

export const interactRule = Facet.define<InteractRule>()

type ViewState = PluginValue & {
	dragging: Target | null,
	hovering: Target | null,
	mouseX: number,
	mouseY: number,
	deco: DecorationSet,
	getMatch(): Target | null,
	updateText(target: Target): (text: string) => void,
	focus(target: Target): void,
	unfocus(): void,
}

const interactViewPlugin = ViewPlugin.define<ViewState>((view) => ({

	dragging: null,
	hovering: null,
	mouseX: 0,
	mouseY: 0,
	deco: Decoration.none,

	getMatch() {

		const rules = view.state.facet(interactRule)
		const pos = view.posAtCoords({ x: this.mouseX, y: this.mouseY })
		if (!pos) return null
		const line = view.state.doc.lineAt(pos)
		const lpos = pos - line.from
		let match = null

		for (const rule of rules) {
			for (const m of line.text.matchAll(rule.regexp)) {
				if (m.index === undefined) continue
				const text = m[0]
				if (!text) continue
				const start = m.index
				const end = m.index + text.length
				if (lpos < start || lpos > end) continue
				if (!match || text.length < match.text.length) {
					match = {
						rule: rule,
						pos: line.from + start,
						text: text,
					}
				}
			}
		}

		return match

	},

	updateText(target) {
		return (text) => {
			view.dispatch({
				changes: {
					from: target.pos,
					to: target.pos + target.text.length,
					insert: text,
				},
			})
			target.text = text
		}
	},

	focus(target) {
		if (target.rule.cursor) {
			document.body.style.cursor = target.rule.cursor
		}
		view.dispatch({
			effects: setInteract.of(target),
		})
	},

	unfocus() {
		document.body.style.cursor = "auto"
		view.dispatch({
			effects: setInteract.of(null),
		})
	},

	update(update) {
		for (const tr of update.transactions) {
			for (const e of tr.effects) {
				if (e.is(setInteract)) {
					const decos = e.value ? mark.range(
						e.value.pos,
						e.value.pos + e.value.text.length,
					) : []
					this.deco = Decoration.set(decos)
				}
			}
		}
	},

}), {

	decorations: (v) => v.deco,

	eventHandlers: {

		mousedown(e, view) {

			if (!e.altKey) return
			const match = this.getMatch()
			if (!match) return
			e.preventDefault()

			if (match.rule.onClick) {
				match.rule.onClick(match.text, this.updateText(match), e)
			}

			if (match.rule.onDrag) {
				this.dragging = {
					rule: match.rule,
					pos: match.pos,
					text: match.text,
				}
			}

		},

		mousemove(e, view) {

			this.mouseX = e.clientX
			this.mouseY = e.clientY

			if (!e.altKey) return

			if (this.dragging) {
				this.focus(this.dragging)
				if (this.dragging.rule.onDrag) {
					this.dragging.rule.onDrag(this.dragging.text, this.updateText(this.dragging), e)
				}
			} else {
				this.hovering = this.getMatch()
				if (this.hovering) {
					this.focus(this.hovering)
				} else {
					this.unfocus()
				}
			}

		},

		mouseup(e, view) {
			this.dragging = null
			if (!this.hovering) {
				this.unfocus()
			}
		},

		keydown(e, view) {
			if (!e.altKey) return
			this.hovering = this.getMatch()
			if (this.hovering) {
				this.focus(this.hovering)
			}
		},

		keyup(e, view) {
			if (!e.altKey) {
				this.unfocus()
			}
		},

	},
})

export default [
	interactTheme,
	interactViewPlugin,
]
