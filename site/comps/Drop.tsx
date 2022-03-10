// TODO: accept DOM / dataTransfer drop

import * as React from "react"
import View, { ViewPropsAnd } from "comps/View"

type FileType =
	| "arrayBuffer"
	| "binaryString"
	| "dataURL"
	| "text"
	;

type FileContent =
	| ArrayBuffer
	| string
	| any
	;

interface DropProps {
	onEnter?: () => void,
	onLeave?: () => void,
	onLoad?: (file: File, content: FileContent) => void,
	onErr?: (file: File) => void,
	onAbort?: (file: File) => void,
	readAs?: FileType | ((file: File) => FileType),
	accept?: string | RegExp | (string | RegExp)[],
	dragColor?: number | string,
}

const Drop = React.forwardRef<HTMLDivElement, ViewPropsAnd<DropProps>>(({
	bg,
	onLoad,
	onErr,
	onAbort,
	onEnter,
	onLeave,
	readAs,
	accept,
	dragColor,
	children,
	...args
}, ref) => {

	const [ counter, setCounter ] = React.useState(0)
	const [ refuse, setRefuse ] = React.useState(false)
	const draggin = counter > 0

	const checkAccept = React.useCallback((mime: string) => {

		// accept anything if no accept is passed
		if (!accept) {
			return true
		}

		const acceptList = Array.isArray(accept) ? accept : [accept]

		for (const pat of acceptList) {
			if (!mime.match(pat)) {
				return false
			}
		}

		return true

	}, [ accept ])

	return (
		<View
			bg={refuse ? "var(--color-errbg)" : (draggin ? (dragColor ?? 2) : bg)}
			onDragEnter={(e) => {

				e.preventDefault()

				const items = e.dataTransfer.items
				if (!items?.length) return

				for (let i = 0; i < items.length; i++) {
					if (items[i].kind !== "file") {
						return
					}
					if (!checkAccept(items[i].type)) {
						setRefuse(true)
						break
					}
				}

				setCounter((c) => {
					if (c == 0) {
						onEnter && onEnter()
					}
					return c + 1
				})

			}}
			onDragLeave={(e) => {

				e.preventDefault()

				const items = e.dataTransfer.items
				if (!items?.length) return

				for (let i = 0; i < items.length; i++) {
					if (items[i].kind !== "file") {
						return
					}
				}

				setCounter((c) => {
					if (c - 1 === 0) {
						onLeave && onLeave()
						setRefuse(false)
					}
					return c - 1
				})

			}}
			onDragOver={(e) => {

				const items = e.dataTransfer.items
				if (!items?.length) return

				for (let i = 0; i < items.length; i++) {
					if (items[i].kind !== "file") {
						return
					}
				}

				e.preventDefault()

			}}
			onDrop={(e) => {

				e.preventDefault()
				setCounter(0)
				setRefuse(false)

				if (refuse || !draggin || !onLoad || !readAs) return

				const items = e.dataTransfer.items
				if (!items?.length) return

				for (let i = 0; i < items.length; i++) {

					if (items[i].kind !== "file") continue
					const file = items[i].getAsFile()
					if (!file) continue

					// get the desired read method of the file
					const ty = typeof readAs === "string" ? readAs : readAs(file)

					// init reader
					const reader = new FileReader()

					// register events
					reader.onload = (e) => {
						if (e.target?.result) {
							onLoad(file, e.target.result)
						}
					}

					reader.onerror = (e) => onErr && onErr(file)
					reader.onabort = (e) => onAbort && onAbort(file)

					// start the reading based on type
					switch (ty) {
						case "dataURL":
							reader.readAsDataURL(file)
							break
						case "arrayBuffer":
							reader.readAsArrayBuffer(file)
							break
						case "text":
							reader.readAsText(file)
							break
						case "binaryString":
							reader.readAsBinaryString(file)
							break
					}

				}

			}}
			{...args}
		>
			{children}
		</View>
	)

})

export default Drop
