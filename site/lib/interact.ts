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

// TODO: better focus logic

interface InteractTarget {
	pos: number,
	text: string,
	rule: InteractRule,
}

export interface InteractRule {
	regex: RegExp,
	onDrag?: (old: string, e: MouseEvent) => string | null,
	onClick?: (old: string, e: MouseEvent) => string | null,
	cursor?: string,
	style?: any,
}

const interact = (rules: InteractRule[]) => {

	let dragging: InteractTarget | null = null;
	let hovering: InteractTarget | null = null;
	let mouseX = 0;
	let mouseY = 0;

	const mark = Decoration.mark({ class: "cm-interact" });

	const setInteract = StateEffect.define<InteractTarget>()
	const clearInteract = StateEffect.define<null>()

	const interactField = StateField.define<DecorationSet>({
		create: () => Decoration.none,
		update: (interacts, tr) => {
			interacts = interacts.map(tr.changes)
			for (let e of tr.effects) {
				if (e.is(setInteract)) {
					interacts = interacts
						.update({
							filter: () => false,
						})
						.update({
							add: [
								mark.range(
									e.value.pos,
									e.value.pos + e.value.text.length
								),
							],
						});
				} else if (e.is(clearInteract)) {
					interacts = interacts.update({
						filter: () => false,
					});
				}
			}
			return interacts;
		},
		provide: (f) => EditorView.decorations.from(f),
	});

	const getMatchFromMouse = (
		view: EditorView,
		x: number,
		y: number
	): InteractTarget | null => {

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

	const focus = (view: EditorView, target: InteractTarget) => {
		if (target.rule.cursor) {
			document.body.style.cursor = target.rule.cursor;
		}
		view.dispatch({
			effects: [
				setInteract.of(target),
			],
		});
	};

	const unfocus = (view: EditorView) => {
		document.body.style.cursor = "auto";
		view.dispatch({
			effects: [
				clearInteract.of(null),
			],
		});
	};

	const updateText = (
		view: EditorView,
		target: InteractTarget,
		text: string | null
	) => {

		if (text === null) return;

		view.dispatch({
			changes: {
				from: target.pos,
				to: target.pos + target.text.length,
				insert: text,
			},
		});

		target.text = text;

	}

	return [

		interactField,

		EditorView.theme({
			".cm-interact": {
				background: "rgba(128, 128, 255, 0.2)",
				borderRadius: "4px",
			},
		}),

		ViewPlugin.define((view) => ({}), {

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

					if (dragging.rule.onClick) {
						updateText(view, dragging, dragging.rule.onClick(dragging.text, e));
					};

				},

				mousemove: (e, view) => {

					mouseX = e.clientX;
					mouseY = e.clientY;
					unfocus(view);

					if (!e.altKey) return;

					hovering = getMatchFromMouse(view, mouseX, mouseY);

					if (hovering) {
						focus(view, hovering);
					} else {
						unfocus(view);
					}

					if (dragging === null) return;

					if (dragging) {
						focus(view, dragging);
					}

					if (dragging.rule.onDrag) {
						updateText(view, dragging, dragging.rule.onDrag(dragging.text, e));
					};

				},

				mouseup: (e, view) => {
					dragging = null;
					if (!hovering && !e.altKey) {
						unfocus(view);
					}
				},

				keydown: (e, view) => {
					if (!e.altKey) return;
					if (!hovering) return;
					hovering = getMatchFromMouse(view, mouseX, mouseY);
					if (hovering) {
						focus(view, hovering);
					}
				},

				keyup: (e, view) => {
					if (!e.altKey) {
						unfocus(view);
					}
				},

			},

		}),

	];

};

export default interact;
