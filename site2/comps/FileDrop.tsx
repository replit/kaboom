import * as React from "react";
import View, { ViewPropsWithChildren } from "comps/View";

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

interface DropZoneProps {
	onDrag?: (hovering: boolean) => void,
	onLoad?: (file: File, content: FileContent) => void,
	onErr?: (file: File) => void,
	onAbort?: (file: File) => void,
	type?: FileType | ((file: File) => FileType),
	accept?: string | string[],
	dragColor?: number | string,
}

const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps & ViewPropsWithChildren>(({
	bg,
	onLoad,
	onErr,
	onAbort,
	onDrag,
	type,
	accept,
	dragColor,
	children,
	...args
}, ref) => {

	const [ counter, setCounter ] = React.useState(0);
	const draggin = counter > 0;

	return (
		<View
			bg={draggin ? (dragColor ?? 2) : bg}
			onDragEnter={(e) => {
				e.preventDefault();
				setCounter((c) => {
					c == 0 && onDrag && onDrag(true);
					return c + 1;
				});
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				setCounter((c) => {
					c == 1 && onDrag && onDrag(false);
					return c - 1;
				});
			}}
			onDragOver={(e) => {
				e.preventDefault();
				if (!onLoad || !type) return;
			}}
			onDrop={(e) => {

				e.preventDefault();

				setCounter((c) => {
					c == 1 && onDrag && onDrag(false);
					return c - 1;
				});

				if (!onLoad || !type) return;

				const items = e.dataTransfer.items;

				if (!items?.length) return;

				for (let i = 0; i < items.length; i++) {

					if (items[i].kind !== "file") continue;
					const file = items[i].getAsFile();
					if (!file) continue;

					// get the desired read method of the file
					const ty = typeof type === "string" ? type : type(file);

					// init reader
					const reader = new FileReader();

					// register events
					reader.onload = (e) => {
						if (e.target?.result) {
							onLoad(file, e.target.result);
						}
					};

					reader.onerror = (e) => onErr && onErr(file);
					reader.onabort = (e) => onAbort && onAbort(file);

					// start the reading based on type
					switch (ty) {
						case "dataURL":
							reader.readAsDataURL(file);
							break;
						case "arrayBuffer":
							reader.readAsArrayBuffer(file);
							break;
						case "text":
							reader.readAsText(file);
							break;
						case "binaryString":
							reader.readAsBinaryString(file);
							break;
					}

				}

			}}
			{...args}
		>
			{children}
		</View>
	);

});

export default DropZone;
