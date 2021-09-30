import * as React from "react";
import { EditorState, Compartment, Extension } from "@codemirror/state";
import { EditorView, keymap, highlightSpecialChars, highlightActiveLine, drawSelection, placeholder, } from "@codemirror/view";
import { defaultHighlightStyle, HighlightStyle, tags as t } from "@codemirror/highlight";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { indentUnit, indentOnInput } from "@codemirror/language";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import { history, historyKeymap } from "@codemirror/history";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets } from "@codemirror/closebrackets";
import { commentKeymap } from "@codemirror/comment";
import { foldGutter } from "@codemirror/fold";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { javascript } from "@codemirror/lang-javascript";

import useUpdateEffect from "hooks/useUpdateEffect";
import View from "comps/view";
import ThemeCtx from "comps/theme";
import { GameViewRef } from "comps/gameview";
import { themes, Theme } from "comps/ui";

// @ts-ignore
const cmThemes: Record<Theme, [ Extension, HighlightStyle ]> = {};

Object.keys(themes).forEach((name) => {

	const theme = themes[name as Theme];
	const yellow = "#e5c07b";
	const red = "#e06c75";
	const cyan = "#56b6c2";
	const ivory = theme["fg2"];
	const stone = theme["fg3"];
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

	cmThemes[name as Theme] = [
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
}

interface EditorProps {
	content?: string,
	onChange?: (code: string) => void,
	keymaps?: any[],
};

const Editor = React.forwardRef<EditorRef, EditorProps>(({
	content,
	onChange,
	keymaps,
	...args
}, ref) => {

	const editorDOMRef = React.useRef(null);
	const cmRef = React.useRef<EditorView | null>(null);
	const themeConfRef = React.useRef<Compartment | null>(null);
	const { theme } = React.useContext(ThemeCtx);

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
	}));

	React.useEffect(() => {

		if (!editorDOMRef.current) {
			return;
		}

		if (cmRef.current) {
			return;
		}

		const cm = new EditorView({
			parent: editorDOMRef.current,
		});

		const themeConf = new Compartment();

		cmRef.current = cm;
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
				placeholder("Come on let's make some games!"),
				history(),
				foldGutter(),
				bracketMatching(),
				closeBrackets(),
				indentOnInput(),
				drawSelection(),
				defaultHighlightStyle,
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						onChange && onChange(update.state.doc.toString());
					}
				}),
				keymap.of([
					...defaultKeymap,
					...historyKeymap,
					...commentKeymap,
					...searchKeymap,
					indentWithTab,
					...(keymaps ?? []),
				]),
			].filter((ext) => ext),
		}));

	}, []);

	useUpdateEffect(() => {

		if (!cmRef.current) return;

		const cm = cmRef.current;

		cm.dispatch({
			changes: {
				from: 0,
				to: cm.state.doc.length,
				insert: content,
			},
		});

	}, [ content ]);

	useUpdateEffect(() => {

		if (!cmRef.current) return;
		if (!themeConfRef.current) return;

		const cm = cmRef.current;
		const themeConf = themeConfRef.current;

		cm.dispatch({
			effects: themeConf.reconfigure(cmThemes[theme])
		});

	}, [ theme ]);

	return (
		<View
			ref={editorDOMRef}
			focusable
			bg={2}
			outlined
			rounded
			css={{
				fontFamily: "IBM Plex Mono",
				overflow: "scroll",
				fontSize: "var(--text-big)",
				":focus": {
					outline: "solid 2px var(--color-highlight)"
				},
			}}
			{...args}
		/>
	);
});

export default Editor;
