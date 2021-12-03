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

	constructor(
		readonly value: number,
		readonly from: number,
		readonly to: number,
	) {
		super()
	}

	eq(other: SliderWidget) {
		return other.value == this.value
	}

	toDOM() {

		const slider = document.createElement("div");

		slider.dataset.from = this.from.toString();
		slider.dataset.to = this.to.toString();
		slider.dataset.value = this.value.toString();
		slider.style.display = "inline-block";
		slider.style.marginLeft = "4px";
		slider.style.width = "16px";
		slider.style.height = "16px";
// 		slider.style.height = "100%";
		slider.style.background = "var(--color-bg1)";
		slider.style.borderRadius = "4px";
		slider.style.cursor = "ew-resize";

		const wrapper = document.createElement("span")
		wrapper.className = "cm-number-slider"
		wrapper.appendChild(slider)
		wrapper.style.height = "100%";

		return wrapper
	}

	ignoreEvent() {
		return false;
	}

}

function sliders(view: EditorView) {

	const widgets: Array<Range<Decoration>> = [];

	for (let {from, to} of view.visibleRanges) {
		syntaxTree(view.state).iterate({
			from,
			to,
			enter: (type, from, to) => {
				if (type.name == "Number") {
					const value = Number(view.state.doc.sliceString(from, to));
					let deco = Decoration.widget({
						widget: new SliderWidget(value, from, to),
						side: 1
					})
					widgets.push(deco.range(to))
				}
			}
		})
	}

	return Decoration.set(widgets);

}

interface Draggin {
	from: number,
	to: number,
}

let draggin: Draggin[] = []

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
			e.preventDefault()
			draggin.push({
				from: Number(el.dataset.from),
				to: Number(el.dataset.to),
			});
			document.body.style.cursor = "ew-resize";
		},
		mousemove: (e, view) => {
			for (const d of draggin) {
				const oldVal = Number(view.state.doc.sliceString(d.from, d.to))
				const newVal = oldVal + e.movementX;
				const diff = newVal.toString().length - oldVal.toString().length;
				view.dispatch({
					changes: {
						from: d.from,
						to: d.to,
						insert: newVal.toString(),
					},
				});
				d.to += diff;
			}
		},
		mouseup: (e, view) => {
			draggin = []
			document.body.style.cursor = "auto";
		},
	},
})

export default sliderPlugin;
