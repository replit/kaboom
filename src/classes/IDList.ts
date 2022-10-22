export class IDList<T> extends Map<number, T> {
    private lastID: number
    constructor(...args) {
        super(...args)
        this.lastID = 0
    }
    push(v: T): number {
        const id = this.lastID
        this.set(id, v)
        this.lastID++
        return id
    }
    pushd(v: T): () => void {
        const id = this.push(v)
        return () => this.delete(id)
    }
}
