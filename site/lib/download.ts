export default function download(
	name: string,
	data: any,
	type: string = "text/plain",
) {
	const a = document.createElement("a")
	a.href = URL.createObjectURL(new Blob([data], { type }))
	a.download = name
	a.click()
	URL.revokeObjectURL(a.href)
}
