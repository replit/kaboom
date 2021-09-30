class IDList<T> extends Map<number, T> {
	_lastID: number;
	constructor(...args: any[]) {
		super(...args);
		this._lastID = 0;
		if (args[0] instanceof IDList) {
			this._lastID = args[0]._lastID;
		}
	}
	push(v: T): number {
		const id = this._lastID;
		this.set(id, v);
		this._lastID++;
		return id;
	}
	pushd(v: T): () => void {
		const id = this.push(v);
		return () => this.delete(id);
	}
}

export default IDList;
