import {
	EditorView,
	WidgetType,
	ViewUpdate,
	ViewPlugin,
	DecorationSet,
	Decoration,
} from "@codemirror/view";

import {StateField, StateEffect} from "@codemirror/state"

import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/rangeset";

const snumMark = Decoration.mark({class: "cm-snum"});

const snumTheme = EditorView.baseTheme({
	".cm-snum": { textDecoration: "underline 3px red" }
});

const NUMBER_RE = /\b(?![a-zA-Z])-?\d+\.?\d*\b(?![a-zA-Z])/g;

function sliders(view: EditorView) {

	const widgets: Array<Range<Decoration>> = [];

	for (let {from, to} of view.visibleRanges) {
		const text = view.state.doc.sliceString(from, to);
		for (const match of text.matchAll(NUMBER_RE)) {
			if (match.index === undefined) continue;
			const num = Number(match[0]);
			if (isNaN(num)) continue;
			widgets.push(snumMark.range(match.index, match.index + match[0].length));
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
			if (!el.parentElement?.classList.contains("cm-snum")) return;
			if (!e.altKey) return;
			e.preventDefault();
			draggin = view.posAtDOM(el);
		},

		mousemove: (e, view) => {

			if (draggin === null) return;

			document.body.style.cursor = "ew-resize";

			const doc = view.state.doc;
			const line = doc.lineAt(draggin);
			const start = draggin;
			let end = start + 1;
			let oldVal = NaN;

			while (end < line.to) {
				const text = doc.sliceString(start, end);
				const val = Number(text);
				if (text[0] === " " || isNaN(val)) {
					end--;
					break;
				} else {
					oldVal = val;
				}
				end++;
			}

			const newVal = oldVal + e.movementX;

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
