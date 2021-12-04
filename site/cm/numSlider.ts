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
			if (match.index === undefined) continue;
			const num = Number(match[0]);
			if (isNaN(num)) continue;
			widgets.push(snumMark.range(match.index, match.index + match[0].length));
		}
	}

	return Decoration.set(widgets);

}

interface Dragging {
	pos: number,
	value: number,
}

let dragging: Dragging | null = null;
let hovering: EventTarget | null = null;

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
			dragging = {
				pos: view.posAtDOM(snum),
				value: Number(snum.textContent),
			};
			document.body.style.cursor = "ew-resize";
		},

		mousemove: (e, view) => {

			hovering = e.target;

			if (e.altKey) {
				document.body.style.cursor =
					(hovering as HTMLElement)
						?.parentElement
						?.classList
						.contains("cm-snum")
					? "ew-resize" : "auto";
			}

			// TODO: change cursor when mouse over a cm-snum
			if (dragging === null) return;

			document.body.style.cursor = "ew-resize";

			const newVal = dragging.value + e.movementX;

			if (isNaN(newVal)) return;

			view.dispatch({
				changes: {
					from: dragging.pos,
					to: dragging.pos + dragging.value.toString().length,
					insert: newVal.toString(),
				},
			});

			dragging.value = newVal;

		},

		mouseup: (e, view) => {
			dragging = null;
			document.body.style.cursor = "auto";
		},

		keydown: (e, view) => {
			if (!e.altKey) return;
			if (
				!(hovering as HTMLElement)
					?.parentElement
					?.classList
					.contains("cm-snum")
			) return;
			document.body.style.cursor = "ew-resize";
		},

		keyup: (e, view) => {
			document.body.style.cursor = "auto";
		},

	},

})

export default sliderPlugin;
