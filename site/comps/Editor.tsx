import * as React from "react"

import {
	EditorState,
	Compartment,
	Extension,
} from "@codemirror/state"

import {
	EditorView,
	keymap,
	highlightSpecialChars,
	highlightActiveLine,
	drawSelection,
	placeholder as cmPlaceholder,
	KeyBinding,
} from "@codemirror/view"

import {
	defaultHighlightStyle,
	HighlightStyle,
	tags as t,
} from "@codemirror/highlight"

import {
	defaultKeymap,
	indentWithTab,
} from "@codemirror/commands"

import {
	indentUnit,
	indentOnInput,
} from "@codemirror/language"

import {
	lineNumbers,
	highlightActiveLineGutter,
} from "@codemirror/gutter"

import {
	history,
	historyKeymap,
} from "@codemirror/history"

import {
	searchKeymap,
	highlightSelectionMatches,
} from "@codemirror/search"

import { bracketMatching } from "@codemirror/matchbrackets"
import { closeBrackets } from "@codemirror/closebrackets"
import { commentKeymap } from "@codemirror/comment"
import { foldGutter } from "@codemirror/fold"
import { javascript } from "@codemirror/lang-javascript"

import useUpdateEffect from "hooks/useUpdateEffect"
import View, { ViewPropsAnd } from "comps/View"
import Ctx from "lib/Ctx"
import { themes } from "lib/ui"
import { clamp, hex2rgb, rgb2hex } from "lib/math"

import interact, { interactRule } from "lib/cm/interact"
import drop, { dropRule } from "lib/cm/drop"
import dropCursor from "lib/cm/dropCursor"
import img from "lib/cm/img"

// @ts-ignore
const cmThemes: Record<Theme, [ Extension, HighlightStyle ]> = {}

Object.keys(themes).forEach((name) => {

	const theme = themes[name]
	const yellow = "#e5c07b"
	const red = "#e06c75"
	const cyan = "#56b6c2"
	const ivory = theme["fg2"]
	const stone = theme["fg4"]
	const invalid = theme["fg4"]
	const blue = "#61afef"
	const green = "#98d379"
	const whiskey = "#d19a66"
	const magenta = "#c678dd"
	const darkBackground = theme["bg1"]
	const highlightBackground = theme["bg3"]
	const background = theme["bg2"]
	const selection = theme["bg4"]
	const cursor = theme["highlight"]

	cmThemes[name] = [
		EditorView.theme({
			"&": {
				color: ivory,
				backgroundColor: background,
			},
			".cm-content": {
				caretColor: cursor,
			},
			".cm-cursor": {
				borderLeftColor: cursor,
				borderLeftWidth: "3px",
				borderRadius: "3px",
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
			".cm-activeLineGutter": {
				color: stone,
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
			".cm-foldPlaceholder": {
				backgroundColor: theme["fg4"],
				border: "none",
				color: theme["fg1"],
			},
		}, { dark: true }),
		HighlightStyle.define([
			{
				tag: t.keyword,
				color: magenta,
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
					t.special(t.string),
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
	]

})

export interface EditorRef {
	getContent: () => string | null,
	getSelection: () => string | null,
	getWord: () => string | null,
	setContent: (content: string) => void,
	getView: () => EditorView | null,
	focus: () => void,
}

interface EditorProps {
	content?: string | (() => string),
	placeholder?: string,
	onChange?: (code: string) => void,
	onSelect?: (code: string) => void,
	keys?: KeyBinding[],
}

const Editor = React.forwardRef<EditorRef, ViewPropsAnd<EditorProps>>(({
	content,
	placeholder,
	keys,
	onChange,
	onSelect,
	...args
}, ref) => {

	const editorDOMRef = React.useRef(null)
	const [ view, setView ] = React.useState<EditorView | null>(null)
	const { theme } = React.useContext(Ctx)

	React.useImperativeHandle(ref, () => ({
		getContent() {
			if (!view) return null
			return view.state.doc.toString()
		},
		getSelection() {
			if (!view) return null
			return view.state.sliceDoc(
				view.state.selection.main.from,
				view.state.selection.main.to,
			)
		},
		getWord() {
			if (!view) return null
			const range = view.state.wordAt(view.state.selection.main.head)
			if (range) {
				return view.state.sliceDoc(range.from, range.to)
			}
			return null
		},
		setContent(content: string) {
			view?.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: content,
				},
			})
		},
		getView() {
			return view
		},
		focus() {
			view?.focus()
		},
	}))

	React.useEffect(() => {

		if (!editorDOMRef.current) {
			throw new Error("Failed to start editor")
		}

		const editorDOM = editorDOMRef.current
		const themeConf = new Compartment()

		const origins = [
			"topleft", "top", "topright",
			"left", "center", "right",
			"botleft", "bot", "botright",
		].map((o) => `"${o}"`)

		// TODO
		const originState = {
			x: 0,
			y: 0,
			idx: -1,
		}

		const view = new EditorView({
			parent: editorDOM,
			state: EditorState.create({
				doc: (typeof content === "function" ? content() : content) ?? "",
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
					dropCursor,
					defaultHighlightStyle,
					EditorView.updateListener.of((update) => {
						const state = update.state
						if (update.docChanged) {
							onChange && onChange(state.doc.toString())
						}
						if (update.selectionSet) {
							const sel = state.sliceDoc(
								state.selection.main.from,
								state.selection.main.to,
							)
							if (sel) {
								onSelect && onSelect(sel)
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
					interact,
					// number slider
					interactRule.of({
						regexp: /-?\b\d+\.?\d*\b/g,
						cursor: "ew-resize",
						onDrag: (text, setText, e) => {
							// TODO: size aware
							// TODO: small interval with shift key?
							const newVal = Number(text) + e.movementX
							if (isNaN(newVal)) return
							setText(newVal.toString())
						},
					}),
					// bool toggler
					interactRule.of({
						regexp: /true|false/g,
						cursor: "pointer",
						onClick: (text, setText) => {
							switch (text) {
								case "true": return setText("false")
								case "false": return setText("true")
							}
						},
					}),
					// kaboom vec2 slider
					interactRule.of({
						regexp: /vec2\(-?\b\d+\.?\d*\b\s*(,\s*-?\b\d+\.?\d*\b)?\)/g,
						cursor: "move",
						onDrag: (text, setText, e) => {
							const res = /vec2\((?<x>-?\b\d+\.?\d*\b)\s*(,\s*(?<y>-?\b\d+\.?\d*\b))?\)/.exec(text)
							let x = Number(res?.groups?.x)
							let y = Number(res?.groups?.y)
							if (isNaN(x)) return
							if (isNaN(y)) y = x
							setText(`vec2(${x + e.movementX}, ${y + e.movementY})`)
						},
					}),
					// kaboom color picker
					interactRule.of({
						regexp: /rgb\(.*\)/g,
						cursor: "pointer",
						onClick: (text, setText, e) => {
							const res = /rgb\((?<r>\d+)\s*,\s*(?<g>\d+)\s*,\s*(?<b>\d+)\)/.exec(text)
							const r = Number(res?.groups?.r)
							const g = Number(res?.groups?.g)
							const b = Number(res?.groups?.b)
							const sel = document.createElement("input")
							sel.type = "color"
							if (!isNaN(r + g + b)) sel.value = rgb2hex(r, g, b)
							sel.addEventListener("input", (e) => {
								const el = e.target as HTMLInputElement
								if (el.value) {
									const [r, g, b] = hex2rgb(el.value)
									setText(`rgb(${r}, ${g}, ${b})`)
								}
							})
							sel.click()
						},
					}),
					// kaboom origin slider
					interactRule.of({
						regexp: new RegExp(`${origins.join("|")}`, "g"),
						cursor: "move",
						onClick: (text) => {
							const idx = origins.indexOf(text)
							originState.x = 0
							originState.y = 0
							originState.idx = idx
						},
						onDrag: (text, setText, e) => {
							originState.x += e.movementX
							originState.y += e.movementY
							const { idx, x, y } = originState
							if (idx === -1) return
							const s = 80
							const sx = clamp(idx % 3 + Math.round(x / s), 0, 2)
							const sy = clamp(Math.floor(idx / 3) + Math.round(y / s), 0, 2)
							setText(origins[sy * 3 + sx])
						},
					}),
					// url clicker
					interactRule.of({
						regexp: /https?:\/\/[^ "]+/g,
						cursor: "pointer",
						onClick: (text) => {
							window.open(text)
						},
					}),
					drop,
					dropRule.of({
						kind: "data",
						format: "code",
					}),
					dropRule.of({
						kind: "file",
						accept: /^image\//,
						readAs: "dataURL",
						process: (data) => {
							if (typeof data === "string") {
								return `"${data}"`
							}
						},
					}),
					dropRule.of({
						kind: "file",
						accept: /^text\//,
						readAs: "text",
					}),
					img,
				].filter((ext) => ext),
			}),
		})

		setView(view)

	}, [])

	useUpdateEffect(() => {
		if (!view) return
		view.dispatch({
			changes: {
				from: 0,
				to: view.state.doc.length,
				insert: (typeof content === "function" ? content() : content) ?? "",
			},
		})
	}, [ content ])

	useUpdateEffect(() => {
		const themeConf = new Compartment()
		view?.dispatch({
			effects: themeConf.reconfigure(cmThemes[theme]),
		})
	}, [ theme ])

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
	)
})

export default Editor
