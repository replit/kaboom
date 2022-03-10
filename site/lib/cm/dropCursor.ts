import { EditorView } from "@codemirror/view"

const dropCursorHandler = EditorView.domEventHandlers({
	dragover(e, view) {
		const pos = view.posAtCoords({ x: e.clientX, y: e.clientY })
		if (pos) {
			view.focus()
			view.dispatch({
				selection: {
					anchor: pos,
				},
			})
		}
	},
})

export default dropCursorHandler
