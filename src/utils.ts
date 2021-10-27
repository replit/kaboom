class IDList<T> extends Map<number, T> {
	_lastID: number;
	constructor(...args) {
		super(...args);
		this._lastID = 0;
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

function deepEq(o1: any, o2: any): boolean {
	const t1 = typeof o1;
	const t2 = typeof o2;
	if (t1 !== t2) {
		return false;
	}
	if (t1 === "object" && t2 === "object") {
		const k1 = Object.keys(o1);
		const k2 = Object.keys(o2);
		if (k1.length !== k2.length) {
			return false;
		}
		for (const k of k1) {
			const v1 = o1[k];
			const v2 = o2[k];
			if (!(typeof v1 === "function" && typeof v2 === "function")) {
				if (!deepEq(v1, v2)) {
					return false;
				}
			}
		}
		return true;
	}
	return o1 === o2;
}

function downloadURL(url: string, filename: string) {
	const a = document.createElement("a");
	document.body.appendChild(a);
	a.setAttribute("style", "display: none");
	a.href = url;
	a.download = filename;
	a.click();
	document.body.removeChild(a);
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	downloadURL(url, filename);
	URL.revokeObjectURL(url);
}

export {
	deepEq,
	IDList,
	downloadBlob,
	downloadURL,
};
