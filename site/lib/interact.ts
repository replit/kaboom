import {
	EditorView,
	ViewPlugin,
	PluginValue,
	DecorationSet,
	Decoration,
} from "@codemirror/view";

import { StateEffect } from "@codemirror/state";

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

interface InteractViewPlugin extends PluginValue {
	deco: DecorationSet,
}

const interact = (rules: InteractRule[]) => {

	let dragging: InteractTarget | null = null;
	let hovering: InteractTarget | null = null;
	let mouseX = 0;
	let mouseY = 0;

	const mark = Decoration.mark({ class: "cm-interact" });

	const setInteract = StateEffect.define<InteractTarget | null>();

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
				setInteract.of(null),
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

		EditorView.theme({
			".cm-interact": {
				background: "rgba(128, 128, 255, 0.2)",
				borderRadius: "4px",
			},
		}),

		ViewPlugin.define<InteractViewPlugin>(() => {
			return {
				deco: Decoration.none,
				update(update) {
					for (const tr of update.transactions) {
						for (const e of tr.effects) {
							if (e.is(setInteract)) {
								this.deco = this.deco.update({
									filter: () => false,
								});
								if (e.value) {
									this.deco = this.deco.update({
										add: [
											mark.range(
												e.value.pos,
												e.value.pos + e.value.text.length
											),
										],
									});
								}
							}
						}
					}
				},
			};
		}, {

			decorations: (v) => v.deco,

			eventHandlers: {

				mousedown: (e, view) => {

					if (!e.altKey) return;
					const match = getMatchFromMouse(view, e.clientX, e.clientY);
					if (!match) return;
					e.preventDefault();

					if (match.rule.onClick) {
						updateText(
							view,
							match,
							match.rule.onClick(match.text, e)
						);
					};

					if (match.rule.onDrag) {
						dragging = {
							rule: match.rule,
							pos: match.pos,
							text: match.text,
						};
					}

				},

				mousemove: (e, view) => {

					mouseX = e.clientX;
					mouseY = e.clientY;

					if (!e.altKey) return;

					if (dragging) {
						focus(view, dragging);
						if (dragging.rule.onDrag) {
							updateText(
								view,
								dragging,
								dragging.rule.onDrag(dragging.text, e)
							);
						}
					} else {
						hovering = getMatchFromMouse(view, mouseX, mouseY);
						if (hovering) {
							focus(view, hovering);
						} else {
							unfocus(view);
						}
					}

				},

				mouseup: (e, view) => {
					dragging = null;
					if (!hovering) {
						unfocus(view);
					}
				},

				keydown: (e, view) => {
					if (!e.altKey) return;
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
