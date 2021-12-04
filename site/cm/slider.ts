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

interface Dragging {
	pos: number,
	text: string,
	rule: SliderRule,
}

export interface SliderRule {
	name: string,
	regex: RegExp,
	transform: (old: string, dx: number, dy: number) => string | null,
	cursor?: string,
	style?: any,
}

const slider = (rules: SliderRule[]) => {

	let dragging: Dragging | null = null;
	let hovering: HTMLElement | null = null;
	const marks: Record<string, Decoration> = {};
	const themes: Record<string, any> = {};

	for (const rule of rules) {
		const className = `cm-${rule.name}`;
		marks[rule.name] = Decoration.mark({ class: className });
		if (rule.style) {
			themes[`.${className}`] = rule.style;
		}
	}

	const theme = EditorView.baseTheme(themes);

	const makeSliders = (view: EditorView) => {

		const widgets: Array<Range<Decoration>> = [];

		for (let {from, to} of view.visibleRanges) {

			const text = view.state.doc.sliceString(from, to);

			for (const rule of rules) {
				for (const match of text.matchAll(rule.regex)) {
					if (match.index === undefined) continue;
					widgets.push(
						marks[rule.name].range(
							match.index,
							match.index + match[0].length
						)
					);
				}
			}

		}

		return Decoration.set(widgets);

	};

	return ViewPlugin.fromClass(class {

		decorations: DecorationSet

		constructor(view: EditorView) {
			this.decorations = makeSliders(view)
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.viewportChanged)
				this.decorations = makeSliders(update.view)
		}

	}, {

		decorations: (v) => v.decorations,

		eventHandlers: {

			mousedown: (e, view) => {

				if (!e.altKey) return;
				const el = (e.target as HTMLElement).parentElement;
				if (!el?.textContent) return;

				for (const rule of rules) {
					if (el.classList.contains(`cm-${rule.name}`)) {
						e.preventDefault();
						dragging = {
							rule: rule,
							pos: view.posAtDOM(el),
							text: el.textContent,
						};
						if (rule.cursor) document.body.style.cursor = rule.cursor;
						break;
					}
				}

			},

			mousemove: (e, view) => {

				hovering = (e.target as HTMLElement)?.parentElement;
				document.body.style.cursor = "auto";
				if (!e.altKey) return;

				for (const rule of rules) {
					if (rule.cursor && hovering?.classList.contains(`cm-${rule.name}`)) {
						document.body.style.cursor = rule.cursor;
						break;
					}
				}

				if (dragging === null) return;

				if (dragging.rule.cursor) {
					document.body.style.cursor = dragging.rule.cursor;
				}

				const newText = dragging.rule.transform(dragging.text, e.movementX, e.movementY);

				if (newText === null) return;

				view.dispatch({
					changes: {
						from: dragging.pos,
						to: dragging.pos + dragging.text.length,
						insert: newText,
					},
				});

				dragging.text = newText;

			},

			mouseup: (e, view) => {
				dragging = null;
				document.body.style.cursor = "auto";
			},

			keydown: (e, view) => {
				if (!e.altKey) return;
				if (!hovering) return;
				for (const rule of rules) {
					if (rule.cursor && hovering.classList.contains(`cm-${rule.name}`)) {
						document.body.style.cursor = rule.cursor;
						break;
					}
				}
			},

			keyup: (e, view) => {
				document.body.style.cursor = "auto";
			},

		},

	});

};

export default slider;
