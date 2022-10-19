import { AssetData } from "./AssetData"

export class AssetBucket<D> {
	assets: Map<string, AssetData<D>> = new Map()
	lastUID: number = 0
	add(name: string | null, loader: Promise<D>): AssetData<D> {
        // if user don't provide a name we use a generated one
		const id = name ?? (this.lastUID++ + "")
		const asset = new AssetData(loader)
		this.assets.set(id, asset)
		return asset
	}
	addLoaded(name: string | null, data: D) {
		const id = name ?? (this.lastUID++ + "")
		const asset = AssetData.loaded(data)
		this.assets.set(id, asset)
	}
	get(handle: string): AssetData<D> | void {
		return this.assets.get(handle)
	}
	progress(): number {
		if (this.assets.size === 0) {
			return 1
		}
		let loaded = 0
		this.assets.forEach((asset) => {
			if (asset.done) {
				loaded++
			}
		})
		return loaded / this.assets.size
	}
}