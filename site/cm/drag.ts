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

interface DragTarget {
	pos: number,
	text: string,
	rule: DragRule,
}

export interface DragRule {
	name: string,
	regex: RegExp,
	transform: (old: string, dx: number, dy: number) => string | null,
	cursor?: string,
	style?: any,
}

const drag = (rules: DragRule[]) => {

	let dragging: DragTarget | null = null;
	let hovering: DragTarget | null = null;

	const getMatchFromMouse = (view: EditorView, x: number, y: number): DragTarget | null => {

		const pos = view.posAtCoords({ x, y });
		if (!pos) return null;
		const line = view.state.doc.lineAt(pos);
		const lpos = pos - line.from;
		let match = null;

		for (const rule of rules) {
			for (const m of line.text.matchAll(rule.regex)) {
				if (m.index === undefined) continue;
				const text = m[0];
				const start = m.index;
				const end = m.index + text.length;
				if (lpos < start || lpos > end) continue;
				if (!match || text.length < match.text.length) {
					match = {
						rule: rule,
						pos: line.from + start,
						text: text,
					};
				}
			}
		}

		return match;

	}

	return ViewPlugin.define(() => ({}), {

		eventHandlers: {

			mousedown: (e, view) => {

				if (!e.altKey) return;
				const match = getMatchFromMouse(view, e.clientX, e.clientY);
				if (!match) return;
				e.preventDefault();

				dragging = {
					rule: match.rule,
					pos: match.pos,
					text: match.text,
				};

				if (match.rule.cursor) document.body.style.cursor = match.rule.cursor;

			},

			mousemove: (e, view) => {

				document.body.style.cursor = "auto";
				hovering = getMatchFromMouse(view, e.clientX, e.clientY);

				if (!e.altKey) return;

				if (hovering?.rule.cursor) {
					document.body.style.cursor = hovering.rule.cursor;
				}

				if (dragging === null) return;

				if (dragging.rule.cursor) {
					document.body.style.cursor = dragging.rule.cursor;
				}

				const newText = dragging.rule.transform(
					dragging.text,
					e.movementX,
					e.movementY
				);

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
				if (hovering?.rule.cursor) {
					document.body.style.cursor = hovering.rule.cursor;
				}
			},

			keyup: (e, view) => {
				document.body.style.cursor = "auto";
			},

		},

	});

};

export default drag;
