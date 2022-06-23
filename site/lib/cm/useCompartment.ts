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

	if (process.env.NODE_ENV === "development") {
		// Fast Refresh forces all hooks to re-run
		// see: https://github.com/apollographql/apollo-client/issues/5870#issuecomment-689098185
		// this sometimes causes our view to be appended with
		// the same compartment which crashes codemirror.
		// To get around that, we will create a new compartment
		// for every Fast Refresh update! Effects that
		// rely on this compartment should re-run anyway

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			compartmentRef.current = new Compartment()
		}, [])
	}

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
	}, [view, compartmentRef.current])

	return compartmentRef.current
}

