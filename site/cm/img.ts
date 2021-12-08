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
		const wrapper = document.createElement("span");
		wrapper.appendChild(img);
		return wrapper;
	}

	ignoreEvent() {
		return false;
	}

}

interface ViewState extends PluginValue {
	deco: DecorationSet,
	hovering: boolean,
}

const view = ViewPlugin.define<ViewState>((view) => {

	const matcher = new MatchDecorator({
		regexp: /"data:image\/\w+;base64,.+"/g,
		decoration: (match, view, pos) => Decoration.replace({
			widget: new ImgWidget(match[0].substring(1, match[0].length - 1), pos),
		}),
	});

	return {
		hovering: false,
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

			edit(el, (dataurl) => {
				view.dispatch({
					changes: {
						from: pos,
						to: pos + el.src.length + 2,
						insert: `"${dataurl}"`,
					},
				});
			});

		},

		mousemove(e, view) {
			const el = e.target as HTMLImageElement;
			this.hovering = el.nodeName === "IMG" && el.classList.contains(className);
			if (e.altKey && this.hovering) {
				document.body.style.cursor = "pointer";
			}
		},

		keydown(e, view) {
			if (e.altKey && this.hovering) {
				document.body.style.cursor = "pointer";
			}
		},

		keyup(e, view) {
			if (!e.altKey) {
				document.body.style.cursor = "auto";
			}
		},

	},

});

// TODO
function edit(src: HTMLImageElement, write: (dataurl: string) => void) {

	const root = src.parentNode;

	if (!root) return;

	const p = pedit({
		from: src,
		root: root,
		styles: {
			background: "var(--color-bg2)",
			border: "solid 2px var(--color-outline)",
			borderRadius: "4px",
		},
	});

	root.removeChild(src);

	const btn = document.createElement("button");
	btn.textContent = "Save";
	btn.onclick = () => write(p.toDataURL());

	root.appendChild(btn);

}

export default view;
