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

// TODO: disallow alpha prefix
const NUMBER_RE = /-?\d+\.?\d*\b(?![a-zA-Z])/g;

function sliders(view: EditorView) {

	const widgets: Array<Range<Decoration>> = [];

	for (let {from, to} of view.visibleRanges) {
		const text = view.state.doc.sliceString(from, to);
		for (const match of text.matchAll(NUMBER_RE)) {
			console.log(match);
			if (match.index === undefined) continue;
			const num = Number(match[0]);
			if (isNaN(num)) continue;
			widgets.push(snumMark.range(match.index, match.index + match[0].length));
		}
	}

	return Decoration.set(widgets);

}

interface Draggin {
	pos: number,
	value: number,
}

let draggin: Draggin | null = null;

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
			// is cm-snum it guaranteed to be the parent?
			const el = e.target as HTMLDivElement;
			const snum = el.parentElement;
			if (!snum?.classList.contains("cm-snum")) return;
			if (!e.altKey) return;
			e.preventDefault();
			draggin = {
				pos: view.posAtDOM(snum),
				value: Number(snum.textContent),
			};
			document.body.style.cursor = "ew-resize";
		},

		mousemove: (e, view) => {

			// TODO: change cursor when mouse over a cm-snum
			if (draggin === null) return;

			document.body.style.cursor = "ew-resize";

			const newVal = draggin.value + e.movementX;

			if (isNaN(newVal)) return;

			view.dispatch({
				changes: {
					from: draggin.pos,
					to: draggin.pos + draggin.value.toString().length,
					insert: newVal.toString(),
				},
			});

			draggin.value = newVal;

		},

		mouseup: (e, view) => {
			draggin = null;
			document.body.style.cursor = "auto";
		},

		// TODO: change cursor when mouse over a cm-snum
// 		keydown: (e, view) => {
// 			if (e.altKey) {
// 				document.body.style.cursor = "ew-resize";
// 			}
// 		},

// 		keyup: (e, view) => {
// 			document.body.style.cursor = "auto";
// 		},

	},

})

export default sliderPlugin;
