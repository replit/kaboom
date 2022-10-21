
// TODO: use PromiseLike or extend Promise?
export declare class AssetData<D> {
	done: boolean
	data: D | null
	error: Error | null
	constructor(loader: Promise<D>)
	static loaded<D>(data: D): AssetData<D>
	onLoad(action: (data: D) => void): AssetData<D>
	onError(action: (err: Error) => void): AssetData<D>
	onFinish(action: () => void): AssetData<D>
	then(action: (data: D) => void): AssetData<D>
	catch(action: (err: Error) => void): AssetData<D>
	finally(action: () => void): AssetData<D>
}
