import {
	EditorView,
	WidgetType,
	ViewUpdate,
	ViewPlugin,
	DecorationSet,
	Decoration,
} from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/rangeset";

class SliderWidget extends WidgetType {

	constructor(readonly value: number) {
		super()
	}

	eq(other: SliderWidget) {
		return other.value == this.value;
	}

	toDOM() {

		const slider = document.createElement("div");

		slider.dataset.value = this.value.toString();
		slider.style.display = "inline-block";
		slider.style.marginLeft = "4px";
		slider.style.width = "16px";
		slider.style.height = "12px";
// 		slider.style.height = "100%";
		slider.style.background = "var(--color-bg1)";
		slider.style.borderRadius = "4px";
		slider.style.cursor = "ew-resize";

		const wrapper = document.createElement("span");
		wrapper.className = "cm-number-slider";
		wrapper.appendChild(slider);
		wrapper.style.height = "100%";

		return wrapper
	}

	ignoreEvent() {
		return false;
	}

}

const NUMBER_RE = /\b(?![a-zA-Z])-?\d+\.?\d*\b(?![a-zA-Z])/g;

function sliders(view: EditorView) {

	const widgets: Array<Range<Decoration>> = [];

	for (let {from, to} of view.visibleRanges) {
		const text = view.state.doc.sliceString(from, to);
		for (const match of text.matchAll(NUMBER_RE)) {
			if (match.index === undefined) continue;
			const num = Number(match[0]);
			if (isNaN(num)) continue;
			const deco = Decoration.widget({
				widget: new SliderWidget(num),
				side: 1,
			});
			widgets.push(deco.range(match.index + match[0].length));
		}
	}

	return Decoration.set(widgets);

}

let draggin: number | null = null;

const sliderPlugin = ViewPlugin.fromClass(class {

	decorations: DecorationSet

	constructor(view: EditorView) {
		this.decorations = sliders(view)
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged)
			this.decorations = sliders(update.view)
	}

}, {

	decorations: v => v.decorations,

	eventHandlers: {

		mousedown: (e, view) => {
			const el = e.target as HTMLDivElement;
			if (!el.parentElement?.classList.contains("cm-number-slider")) return;
			e.preventDefault();
			draggin = view.posAtDOM(el);
		},

		mousemove: (e, view) => {

			if (draggin === null) return;

			document.body.style.cursor = "ew-resize";

			const doc = view.state.doc;
			const line = doc.lineAt(draggin);
			const end = draggin;
			let start = end - 1;
			let oldVal = NaN;

			while (start >= line.from) {
				const text = doc.sliceString(start, end);
				const val = Number(text);
				if (text[0] === " " || isNaN(val)) {
					start++;
					break;
				} else {
					oldVal = val;
				}
				start--;
			}

			const newVal = oldVal + e.movementX;
			draggin += newVal.toString().length - oldVal.toString().length;

			if (isNaN(newVal)) return;

			view.dispatch({
				changes: {
					from: start,
					to: end,
					insert: newVal.toString(),
				},
			});

		},

		mouseup: (e, view) => {
			draggin = null;
			document.body.style.cursor = "auto";
		},

	},

})

export default sliderPlugin;
