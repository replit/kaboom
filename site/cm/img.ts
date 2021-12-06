import {
	EditorView,
	ViewPlugin,
	PluginValue,
	DecorationSet,
	Decoration,
	WidgetType,
	MatchDecorator,
} from "@codemirror/view";

import {
	StateEffect,
	Facet,
} from "@codemirror/state";

interface ViewState extends PluginValue {
	deco: DecorationSet,
}

class ImgWidget extends WidgetType {

	constructor(
		readonly src: string,
	) {
		super();
	}

	eq(other: ImgWidget) {
		return this.src === other.src;
	}

	toDOM() {
		const img = document.createElement("img");
		img.src = this.src;
// 		img.addEventListener("mousedown", () => {
// 			console.log(23);
// 		});
		const wrapper = document.createElement("span");
		wrapper.appendChild(img);
		return wrapper;
	}

}

const view = ViewPlugin.define<ViewState>((view) => {
	const m = new MatchDecorator({
		regexp: /"data:image\/\w+;base64,.+"/g,
		decoration: (match, view, pos) => Decoration.replace({
			widget: new ImgWidget(match[0].substring(1, match[0].length - 1)),
		}),
	});
	return {
		deco: m.createDeco(view),
		update(update) {
			if (update.docChanged) {
				this.deco = m.updateDeco(update, this.deco);
			}
		},
	};

}, {
	decorations: (v) => v.deco,
})

export default view;
