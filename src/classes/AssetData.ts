import { KaboomEvent } from "./KaboomEvent"

/*
// TODO: use PromiseLike or extend Promise?
//export declare class Asset<D> {
	declare class Asset<D> {
		done: boolean
		data: D | null
		error: Error | null
		constructor(loader: Promise<D>)
		static loaded<D>(data: D): Asset<D>
		onLoad(action: (data: D) => void): Asset<D>
		onError(action: (err: Error) => void): Asset<D>
		onFinish(action: () => void): Asset<D>
		then(action: (data: D) => void): Asset<D>
		catch(action: (err: Error) => void): Asset<D>
		finally(action: () => void): Asset<D>
	}
*/

export class AssetData<D> {
	done: boolean = false
	data: D | null = null
	error: Error | null = null
	private onLoadEvents: KaboomEvent<[D]> = new KaboomEvent()
	private onErrorEvents: KaboomEvent<[Error]> = new KaboomEvent()
	private onFinishEvents: KaboomEvent<[]> = new KaboomEvent()
	constructor(loader: Promise<D>) {
		loader.then((data) => {
			this.data = data
			this.onLoadEvents.trigger(data)
		}).catch((err) => {
			this.error = err
			if (this.onErrorEvents.numListeners() > 0) {
				this.onErrorEvents.trigger(err)
			} else {
				throw err
			}
		}).finally(() => {
			this.onFinishEvents.trigger()
			this.done = true
		})
	}
	static loaded<D>(data: D): AssetData<D> {
		const asset = new AssetData(Promise.resolve(data))
		asset.data = data
		asset.done = true
		return asset
	}
	onLoad(action: (data: D) => void) {
		this.onLoadEvents.add(action)
		return this
	}
	onError(action: (err: Error) => void) {
		this.onErrorEvents.add(action)
		return this
	}
	onFinish(action: () => void) {
		this.onFinishEvents.add(action)
		return this
	}
	then(action: (data: D) => void): AssetData<D> {
		return this.onLoad(action)
	}
	catch(action: (err: Error) => void): AssetData<D> {
		return this.onError(action)
	}
	finally(action: () => void): AssetData<D> {
		return this.onFinish(action)
	}
}