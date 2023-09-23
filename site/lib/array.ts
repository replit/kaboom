export const findLastIndex = (array: string[], searchValue: string, searchIndex: number) => {
	const index = array.slice().reverse().findIndex((item: string) => item[searchIndex] === searchValue[searchIndex])
	const count = array.length - 1
	const lastIndex = index >= 0 ? count - index : index
	return lastIndex
}