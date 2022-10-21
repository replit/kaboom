import { AssetData } from "./AssetData"

// TODO: use PromiseLike or extend Promise?
export declare class AssetBucket<D> {
    assets: Map<string, AssetBucket<D>>
    lastUID: number
    add(name: string | null, loader: Promise<D>): AssetData<D>
    addLoaded(name: string | null, data: D): void
    get(handle: string): AssetData<D> | void
    progress(): number
}
