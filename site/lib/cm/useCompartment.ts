import { useEffect, useRef } from "react"
import { Compartment, StateEffect, Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

/**
 * Creates a compartment, appends it to the view config, and
 * returns it for further reconfiguration. If the component
 * using this extension unmounts, or the view changes, the
 * compartment will remove any configuration.
 * If `initialExtension` is passed, it will use the extension
 * as part of the initial configuration.
 * You do not have to worry about memoizing `initialExtensions`
 * as they're only applied once per editor view.
 */
export default function useCompartment({
	view,
	initialExtension = [],
}: {
  view: EditorView | null;
  initialExtension?: Extension;
}) {
	const compartmentRef = useRef(new Compartment())

	useEffect(() => {
		compartmentRef.current = new Compartment()
	}, [])

	useEffect(() => {
		if (!view) {
			return
		}

		const compartment = compartmentRef.current

		view.dispatch({
			effects: StateEffect.appendConfig.of(compartment.of(initialExtension)),
		})

		return () => {
			view.dispatch({
				effects: compartment.reconfigure([]),
			})
		}
    // initialExtension excluded intentionally
	}, [view])

	return compartmentRef.current
}

