type Observable<T> = {
	set(v: T),
	get(): T,
	sub(cb: (v: T) => void),
}

export default (k: KaboomCtx) => {

	// reactive state
	function observe<T>(data: T): Observable<T> {

		const subs = {};
		let lastSubID = 0;

		return {
			set(val) {
				if (typeof val === "function") {
					this.set(val(data));
					return;
				}
				data = val;
				for (const id in subs) {
					subs[id](data);
				}
			},
			get() {
				return data;
			},
			sub(cb) {
				const id = lastSubID++;
				subs[id] = cb;
				return () => {
					delete subs[id];
				};
			},
		};

	}

	return {
		observe,
	};

};
