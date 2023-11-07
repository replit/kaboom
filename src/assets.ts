import {
	Event,
} from "./utils"

export class Asset<D> {
	loaded: boolean = false
	data: D | null = null
	error: Error | null = null
	private onLoadEvents: Event<[D]> = new Event()
	private onErrorEvents: Event<[Error]> = new Event()
	private onFinishEvents: Event<[]> = new Event()
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
			this.loaded = true
		})
	}
	static loaded<D>(data: D): Asset<D> {
		const asset = new Asset(Promise.resolve(data)) as Asset<D>
		asset.data = data
		asset.loaded = true
		return asset
	}
	onLoad(action: (data: D) => void) {
		if (this.loaded && this.data) {
			action(this.data)
		} else {
			this.onLoadEvents.add(action)
		}
		return this
	}
	onError(action: (err: Error) => void) {
		if (this.loaded && this.error) {
			action(this.error)
		} else {
			this.onErrorEvents.add(action)
		}
		return this
	}
	onFinish(action: () => void) {
		if (this.loaded) {
			action()
		} else {
			this.onFinishEvents.add(action)
		}
		return this
	}
	then(action: (data: D) => void): Asset<D> {
		return this.onLoad(action)
	}
	catch(action: (err: Error) => void): Asset<D> {
		return this.onError(action)
	}
	finally(action: () => void): Asset<D> {
		return this.onFinish(action)
	}
}

export class AssetBucket<D> {
	assets: Map<string, Asset<D>> = new Map()
	lastUID: number = 0
	add(name: string | null, loader: Promise<D>): Asset<D> {
		// if user don't provide a name we use a generated one
		const id = name ?? (this.lastUID++ + "")
		const asset = new Asset(loader)
		this.assets.set(id, asset)
		return asset
	}
	addLoaded(name: string | null, data: D): Asset<D> {
		const id = name ?? (this.lastUID++ + "")
		const asset = Asset.loaded(data)
		this.assets.set(id, asset)
		return asset
	}
	get(handle: string): Asset<D> | void {
		return this.assets.get(handle)
	}
	progress(): number {
		if (this.assets.size === 0) {
			return 1
		}
		let loaded = 0
		this.assets.forEach((asset) => {
			if (asset.loaded) {
				loaded++
			}
		})
		return loaded / this.assets.size
	}
}

export function fetchURL(url: string) {
	return fetch(url)
		.then((res) => {
			if (!res.ok) throw new Error(`Failed to fetch "${url}"`)
			return res
		})
}

export function fetchJSON(path: string) {
	return fetchURL(path).then((res) => res.json())
}

export function fetchText(path: string) {
	return fetchURL(path).then((res) => res.text())
}

export function fetchArrayBuffer(path: string) {
	return fetchURL(path).then((res) => res.arrayBuffer())
}

// wrapper around image loader to get a Promise
export function loadImg(src: string): Promise<HTMLImageElement> {
	const img = new Image()
	img.crossOrigin = "anonymous"
	img.src = src
	return new Promise<HTMLImageElement>((resolve, reject) => {
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error(`Failed to load image from "${src}"`))
	})
}
