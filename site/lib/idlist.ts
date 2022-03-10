class IDList<T> extends Map<number, T> {
	_lastID: number
	constructor(...args: any[]) {
		super(...args)
		this._lastID = 0
	}
	clone(): IDList<T> {
		const n = new IDList<T>(this)
		n._lastID = this._lastID
		return n
	}
	push(v: T): number {
		const id = this._lastID
		this.set(id, v)
		this._lastID++
		return id
	}
	pushd(v: T): () => void {
		const id = this.push(v)
		return () => this.delete(id)
	}
}

export default IDList
