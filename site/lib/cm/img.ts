import {
	EditorView,
	ViewPlugin,
	PluginValue,
	DecorationSet,
	Decoration,
	WidgetType,
	MatchDecorator,
	PluginField,
} from "@codemirror/view"

import Pedit from "lib/pedit"

const className = "cm-img"

class ImgWidget extends WidgetType {

	constructor(
		readonly src: string,
		readonly pos: number,
	) {
		super()
	}

	eq(other: ImgWidget) {
		return this.src === other.src && this.pos === other.pos
	}

	toDOM() {
		const img = document.createElement("img")
		img.src = this.src
		img.dataset.pos = this.pos.toString()
		img.classList.add(className)
		img.style.maxHeight = "64px"
		img.style.maxWidth = "256px"
		return img
	}

	ignoreEvent() {
		return false
	}

}

const imgTheme = EditorView.theme({
	".cm-pedit": {
		background: "var(--color-bg2)",
		border: "solid 2px var(--color-outline)",
		borderRadius: "4px",
		margin: "0",
	},
	".cm-pedit:focus": {
		border: "solid 2px var(--color-highlight)",
	},
})

class PeditWidget extends WidgetType {

	btn: HTMLButtonElement | null = null

	constructor(
		readonly src: string,
		readonly pos: number,
		readonly pedit: Pedit,
	) {
		super()
	}

	eq(other: PeditWidget) {
		return this.src === other.src && this.pos === other.pos && this.pedit === other.pedit
	}

	toDOM() {

		const wrapper = document.createElement("span")

		wrapper.append(this.pedit.canvas)
		this.pedit.showUI = false
		this.pedit.canvas.classList.add("cm-pedit")
		// TODO
		setTimeout(() => this.pedit.focus(), 100)

		const btn = document.createElement("button")

		btn.style.background = "var(--color-bg3)"
		btn.style.borderRadius = "8px"
		btn.style.padding = "4px 8px"
		btn.style.cursor = "pointer"
		btn.style.border = "solid 2px var(--color-outline)"
		btn.style.marginLeft = "8px"
		btn.style.fontSize = "var(--text-normal)"
		btn.style.color = "var(--color-fg1)"
		btn.textContent = "Save"
		wrapper.append(btn)
		this.btn = btn

		return wrapper

	}

	ignoreEvent(e: Event) {
		if (e.target === this.btn) {
			return false
		}
		if (e instanceof KeyboardEvent) {
			if (e.key === "Enter" || e.key === "Escape") {
				return false
			}
		}
		return true
	}

}

type Editing = {
	pedit: Pedit,
	src: string,
	pos: number,
}

type ViewState = PluginValue & {
	deco: DecorationSet,
	hovering: HTMLElement | null,
	editing: Editing | null,
	matcher: MatchDecorator,
}

const imgViewPlugin = ViewPlugin.define<ViewState>((view) => {

	const matcher: MatchDecorator = new MatchDecorator({
		regexp: /"data:image\/\w+;base64,[^"\s]+"/g,
		decoration: (match, view, pos) => {
			const src = match[0].substring(1, match[0].length - 1)
			return Decoration.replace({
				widget: v?.editing?.src === src && v?.editing?.pos === pos
					? new PeditWidget(v.editing.src, v.editing.pos, v.editing.pedit)
					: new ImgWidget(src, pos),
			})
		},
// 		maxLength: 65536,
	})

	const v: ViewState = {
		matcher: matcher,
		hovering: null,
		editing: null,
		deco: matcher.createDeco(view),
		update(update) {
			if (update.docChanged) {
				this.deco = matcher.updateDeco(update, this.deco)
			}
		},
	}

	return v

}, {

	decorations: (v) => v.deco,
	provide: PluginField.atomicRanges.from((v) => v.deco),

	eventHandlers: {

		mousedown(e, view) {

			const el = e.target as HTMLElement

			if (e.altKey) {
				if (el.nodeName !== "IMG" || !el.classList.contains(className)) return
				const pos = Number(el.dataset.pos)
				const src = (el as HTMLImageElement).src
				Pedit.fromImg(src).then((p) => {
					this.editing = {
						pedit: p,
						src: src,
						pos: pos,
					}
					this.deco = this.matcher.createDeco(view)
				})
			}

			// TODO
			// @ts-ignore
			if (this.editing && el.nodeName === "BUTTON") {
				view.dispatch({
					changes: {
						from: this.editing.pos + 1,
						to: this.editing.pos + this.editing.src.length + 1,
						insert: this.editing.pedit.toDataURL(),
					},
				})
				this.editing.pedit.cleanUp()
				this.editing = null
				this.deco = this.matcher.createDeco(view)
			}

		},

		mousemove(e, view) {
			const el = e.target as HTMLImageElement
			const isImg = el.nodeName === "IMG" && el.classList.contains(className)
			if (isImg) {
				this.hovering = el
			} else {
				if (this.hovering) {
					this.hovering.style.cursor = "auto"
				}
				this.hovering = null
			}
			if (e.altKey && this.hovering) {
				this.hovering.style.cursor = "pointer"
			}
		},

		keydown(e, view) {
			if (e.altKey && this.hovering) {
				this.hovering.style.cursor = "pointer"
			}
			if (this.editing) {
				switch (e.key) {
					// TODO: not capturing "Enter" key
					case "Enter": {
						view.dispatch({
							changes: {
								from: this.editing.pos + 1,
								to: this.editing.pos + this.editing.src.length + 1,
								insert: this.editing.pedit.toDataURL(),
							},
						})
						this.editing.pedit.cleanUp()
						this.editing = null
						this.deco = this.matcher.createDeco(view)
						break
					}
					case "Escape": {
						this.editing.pedit.cleanUp()
						this.editing = null
						this.deco = this.matcher.createDeco(view)
						break
					}
				}
			}
		},

		keyup(e, view) {
			if (!e.altKey && this.hovering) {
				this.hovering.style.cursor = "auto"
			}
		},

	},

})

export default [
	imgTheme,
	imgViewPlugin,
]
