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

class ImgEditWidget extends WidgetType {

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
		return img;
	}

	ignoreEvent() {
		return false;
	}

}

interface ViewState extends PluginValue {
	deco: DecorationSet,
}

const view = ViewPlugin.define<ViewState>((view) => {

	const matcher = new MatchDecorator({
		regexp: /"data:image\/\w+;base64,.+"/g,
		decoration: (match, view, pos) => Decoration.replace({
			widget: new ImgWidget(match[0].substring(1, match[0].length - 1), pos),
		}),
	});

	return {
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

			edit(el.src, (dataurl) => {
				view.dispatch({
					changes: {
						from: pos,
						to: pos + el.src.length + 2,
						insert: `"${dataurl}"`,
					},
				});
			});

		},

	},

});

function edit(src: string, write: (dataurl: string) => void) {
	// ...
}

export default view;
