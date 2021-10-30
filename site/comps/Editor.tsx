import * as React from "react";

import {
	EditorState,
	Compartment,
	Extension,
} from "@codemirror/state";

import {
	EditorView,
	keymap,
	highlightSpecialChars,
	highlightActiveLine,
	drawSelection,
	placeholder as cmPlaceholder,
	KeyBinding
} from "@codemirror/view";

import {
	defaultHighlightStyle,
	HighlightStyle,
	tags as t
} from "@codemirror/highlight";

import {
	defaultKeymap,
	indentWithTab,
} from "@codemirror/commands";

import {
	indentUnit,
	indentOnInput,
} from "@codemirror/language";

import {
	lineNumbers,
	highlightActiveLineGutter,
} from "@codemirror/gutter";

import {
	history,
	historyKeymap,
} from "@codemirror/history";

import {
	searchKeymap,
	highlightSelectionMatches,
} from "@codemirror/search";

import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets } from "@codemirror/closebrackets";
import { commentKeymap } from "@codemirror/comment";
import { foldGutter } from "@codemirror/fold";
import { javascript } from "@codemirror/lang-javascript";

import useUpdateEffect from "hooks/useUpdateEffect";
import View, { ViewProps } from "comps/View";
import Ctx from "lib/Ctx";
import { themes } from "lib/ui";

// @ts-ignore
const cmThemes: Record<Theme, [ Extension, HighlightStyle ]> = {};

Object.keys(themes).forEach((name) => {

	const theme = themes[name];
	const yellow = "#e5c07b";
	const red = "#e06c75";
	const cyan = "#56b6c2";
	const ivory = theme["fg2"];
	const stone = theme["fg4"];
	const invalid = theme["fg4"];
	const blue = "#61afef";
	const green = "#98d379";
	const whiskey = "#d19a66";
	const magenta = "#c678dd";
	const darkBackground = theme["bg1"];
	const highlightBackground = theme["bg3"];
	const background = theme["bg2"];
	const selection = theme["bg4"];
	const cursor = theme["highlight"];

	cmThemes[name] = [
		EditorView.theme({
			"&": {
				color: ivory,
				backgroundColor: background,
			},
			".cm-content": {
				caretColor: cursor,
			},
			"&.cm-focused .cm-cursor": {
				borderLeftColor: cursor,
			},
			"&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
				backgroundColor: selection,
			},
			".cm-panels": {
				backgroundColor: darkBackground,
				color: ivory,
			},
			".cm-panels.cm-panels-top": {
				borderBottom: "2px solid black",
			},
			".cm-panels.cm-panels-bottom": {
				borderTop: "2px solid black",
			},
			".cm-searchMatch": {
				backgroundColor: "#72a1ff59",
				outline: "1px solid #457dff",
			},
			".cm-searchMatch.cm-searchMatch-selected": {
				backgroundColor: "#6199ff2f",
			},
			".cm-activeLine": {
				backgroundColor: highlightBackground,
			},
			".cm-selectionMatch": {
				backgroundColor: "#aafe661a",
			},
			".cm-matchingBracket, .cm-nonmatchingBracket": {
				backgroundColor: "#bad0f847",
				outline: "1px solid #515a6b",
			},
			".cm-gutters": {
				backgroundColor: background,
				color: stone,
				border: "none",
			},
			".cm-activeLineGutter": {
				color: stone,
				backgroundColor: highlightBackground,
			},
			".cm-foldPlaceholder": {
				backgroundColor: theme["fg4"],
				border: "none",
				color: theme["fg1"],
			},
		}, { dark: true, }),
		HighlightStyle.define([
			{
				tag: t.keyword,
				color: magenta
			},
			{
				tag: [
//  					t.name,
					t.deleted,
					t.character,
					t.macroName,
//  					t.propertyName,
				],
				color: red,
			},
			{
				tag: [
					t.function(t.variableName),
					t.labelName,
				],
				color: blue,
			},
			{
				tag: [
					t.color,
					t.constant(t.name),
					t.standard(t.name),
				],
				color: whiskey,
			},
			{
				tag: [
					t.definition(t.name),
					t.separator,
				],
				color: ivory,
			},
			{
				tag: [
					t.typeName,
					t.className,
					t.number,
					t.changed,
					t.annotation,
					t.modifier,
					t.self,
					t.namespace,
				],
				color: yellow,
			},
			{
				tag: [
					t.operator,
					t.operatorKeyword,
					t.url,
					t.escape,
					t.regexp,
					t.link,
					t.special(t.string)
				],
				color: cyan,
			},
			{
				tag: [
					t.meta,
					t.comment,
				],
				color: stone,
			},
			{
				tag: t.strong,
				fontWeight: "bold",
			},
			{
				tag: t.emphasis,
				fontStyle: "italic",
			},
			{
				tag: t.strikethrough,
				textDecoration: "line-through",
			},
			{
				tag: t.link,
				color: stone,
				textDecoration: "underline",
			},
			{
				tag: t.heading,
				fontWeight: "bold",
				color: red,
			},
			{
				tag: [
					t.atom,
					t.bool,
					t.special(t.variableName),
				],
				color: whiskey,
			},
			{
				tag: [
					t.processingInstruction,
					t.string,
					t.inserted,
				],
				color: green,
			},
			{
				tag: t.invalid,
				color: invalid,
			},
		]),
	];

});

export interface EditorRef {
	getContent: () => string | null,
	getSelection: () => string | null,
	getWord: () => string | null,
	setContent: (content: string) => void,
	getCodeMirror: () => EditorView | null,
}

interface EditorProps {
	content?: string,
	placeholder?: string,
	onChange?: (code: string) => void,
	onSelect?: (code: string) => void,
	keys?: KeyBinding[],
};

const Editor = React.forwardRef<EditorRef, EditorProps & ViewProps>(({
	content,
	placeholder,
	keys,
	onChange,
	onSelect,
	...args
}, ref) => {

	const editorDOMRef = React.useRef(null);
	const cmRef = React.useRef<EditorView | null>(null);
	const themeConfRef = React.useRef<Compartment | null>(null);
	const { theme } = React.useContext(Ctx);

	React.useImperativeHandle(ref, () => ({
		getContent() {
			if (!cmRef.current) return null;
			const cm = cmRef.current;
			return cm.state.doc.toString();
		},
		getSelection() {
			if (!cmRef.current) return null;
			const cm = cmRef.current;
			return cm.state.sliceDoc(
				cm.state.selection.main.from,
				cm.state.selection.main.to
			)
		},
		getWord() {
			if (!cmRef.current) return null;
			const cm = cmRef.current;
			const range = cm.state.wordAt(cm.state.selection.main.head);
			if (range) {
				return cm.state.sliceDoc(range.from, range.to);
			}
			return null;
		},
		setContent(content: string) {
			if (!cmRef.current) return null;
			const cm = cmRef.current;
			cm.dispatch({
				changes: {
					from: 0,
					to: cm.state.doc.length,
					insert: content,
				},
			});
		},
		getCodeMirror() {
			return cmRef.current;
		},
	}));

	React.useEffect(() => {

		if (!editorDOMRef.current) return;
		const editorDOM = editorDOMRef.current;

		if (!cmRef.current) {
			cmRef.current = new EditorView({
				parent: editorDOM,
			});
		}

		const cm = cmRef.current;
		const themeConf = new Compartment();

		themeConfRef.current = themeConf;

		if (cmRef) {
			cmRef.current = cm;
		}

		cm.setState(EditorState.create({
			doc: content ?? "",
			extensions: [
				themeConf.of(cmThemes[theme]),
				EditorState.tabSize.of(4),
				EditorState.allowMultipleSelections.of(true),
				indentUnit.of("\t"),
				javascript(),
				lineNumbers(),
				highlightSpecialChars(),
				highlightActiveLine(),
				highlightActiveLineGutter(),
				highlightSelectionMatches(),
				cmPlaceholder(placeholder ?? ""),
				history(),
				foldGutter(),
				bracketMatching(),
				closeBrackets(),
				indentOnInput(),
				drawSelection(),
				defaultHighlightStyle,
				EditorView.updateListener.of((update) => {
					const state = update.state;
					if (update.docChanged) {
						onChange && onChange(state.doc.toString());
					}
					if (update.selectionSet) {
						const sel = state.sliceDoc(
							state.selection.main.from,
							state.selection.main.to
						);
						if (sel) {
							onSelect && onSelect(sel);
						}
					}
				}),
				keymap.of([
					...defaultKeymap,
					...historyKeymap,
					...commentKeymap,
					...searchKeymap,
					indentWithTab,
					...(keys ?? []),
				]),
			].filter((ext) => ext),
		}));

	}, [ content ]);

	useUpdateEffect(() => {

		if (!cmRef.current) return;
		const cm = cmRef.current;
		if (!themeConfRef.current) return;
		const themeConf = themeConfRef.current;

		cm.dispatch({
			effects: themeConf.reconfigure(cmThemes[theme])
		});

	}, [ theme ]);

	return (
		<View
			ref={editorDOMRef}
			bg={2}
			outlined
			rounded
			css={{
				fontFamily: "IBM Plex Mono",
				overflow: "hidden",
				fontSize: "var(--text-normal)",
				":focus-within": {
					boxShadow: "0 0 0 2px var(--color-highlight)",
				},
				".cm-editor": {
					userSelect: "auto",
					width: "100% !important",
					height: "100% !important",
				},
				".cm-editor > *": {
					fontFamily: "inherit !important",
				},
			}}
			{...args}
		/>
	);
});

export default Editor;
