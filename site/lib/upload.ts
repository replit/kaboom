export default function openFileDialog(
	handler: (f: File) => void,
	accept: string[],
) {

	const uploader = document.createElement("input")
	uploader.type = "file"
	uploader.accept = accept.join(",")

	const onChange = () => {
		if (!uploader.files) return;
		[...uploader.files].forEach(handler)
		uploader.removeEventListener("change", onChange)
	}

	uploader.addEventListener("change", onChange)
	uploader.click()

}
