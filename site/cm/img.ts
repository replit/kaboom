import {
	EditorView,
	ViewPlugin,
	PluginValue,
	DecorationSet,
	Decoration,
	WidgetType,
	MatchDecorator,
	PluginField,
} from "@codemirror/view";

import {
	StateEffect,
	Facet,
} from "@codemirror/state";

import pedit from "lib/pedit";

const className = "cm-img";

class ImgWidget extends WidgetType {

	constructor(
		readonly src: string,
		readonly pos: number,
	) {
		super();
	}

	eq(other: ImgWidget) {
		return this.src === other.src && this.pos === other.pos;
	}

	toDOM() {
		const img = document.createElement("img");
		img.src = this.src;
		img.dataset.pos = this.pos.toString();
		img.classList.add(className);
		img.style.maxHeight = "64px";
		img.style.maxWidth = "256px";
		return img;
	}

	ignoreEvent() {
		return false;
	}

}

class PeditWidget extends WidgetType {

	constructor(
		readonly src: string,
		readonly pos: number,
	) {
		super();
	}

	eq(other: PeditWidget) {
		return this.src === other.src && this.pos === other.pos;
	}

	toDOM() {

		const wrapper = document.createElement("span");

		pedit({
			from: this.src,
			styles: {
				background: "var(--color-bg2)",
				border: "solid 2px var(--color-outline)",
				borderRadius: "4px",
				margin: "0",
			},
		}).then((p) => {
			p.showUI = false;
			p.focus();
			p.canvas.dataset.pos = this.pos.toString();
			wrapper.append(p.canvas);
			wrapper.append(btn);
		});

		const btn = document.createElement("button");

		btn.style.background = "var(--color-bg3)";
		btn.style.borderRadius = "8px";
		btn.style.padding = "4px 8px";
		btn.style.cursor = "pointer";
		btn.style.border = "solid 2px var(--color-outline)";
		btn.style.marginLeft = "8px";
		btn.style.fontSize = "var(--text-normal)";
		btn.textContent = "Save";

		return wrapper;

	}

	ignoreEvent() {
		return true;
	}

}

interface ViewState extends PluginValue {
	deco: DecorationSet,
	hovering: HTMLElement | null,
	editing: string | null,
	matcher: MatchDecorator,
}

const viewPlugin = ViewPlugin.define<ViewState>((view) => {

	const matcher: MatchDecorator = new MatchDecorator({
		regexp: /"data:image\/\w+;base64,.+"/g,
		decoration: (match, view, pos) => {
			const v: ViewState | null = view.plugin<ViewState>(viewPlugin);
			const src = match[0].substring(1, match[0].length - 1);
			return Decoration.replace({
				widget: v?.editing === src
					? new PeditWidget(src, pos)
					: new ImgWidget(src, pos),
			});
		}
	});

	return {
		matcher: matcher,
		hovering: null,
		editing: null,
		deco: matcher.createDeco(view),
		update(update) {
			if (update.docChanged) {
				this.deco = matcher.updateDeco(update, this.deco);
			}
		},
	};

}, {

	decorations: (v) => v.deco,
	provide: PluginField.atomicRanges.from((v) => v.deco),

	eventHandlers: {

		mousedown(e, view) {

			if (!e.altKey) return;
			const el = e.target as HTMLImageElement;
			if (el.nodeName !== "IMG" || !el.classList.contains(className)) return;
			const pos = Number(el.dataset.pos);

			this.editing = el.src;
			this.deco = this.matcher.createDeco(view);

		},

		mousemove(e, view) {
			const el = e.target as HTMLImageElement;
			const isImg = el.nodeName === "IMG" && el.classList.contains(className);
			if (isImg) {
				this.hovering = el;
			} else {
				if (this.hovering) {
					this.hovering.style.cursor = "auto";
				}
				this.hovering = null;
			}
			if (e.altKey && this.hovering) {
				this.hovering.style.cursor = "pointer";
			}
		},

		keydown(e, view) {
			if (e.altKey && this.hovering) {
				this.hovering.style.cursor = "pointer";
			}
		},

		keyup(e, view) {
			if (!e.altKey && this.hovering) {
				this.hovering.style.cursor = "auto";
			}
		},

	},

});

export default viewPlugin;
