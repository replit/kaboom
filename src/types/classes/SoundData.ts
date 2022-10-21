import { AudioData } from "../../types"

export declare class SoundData {
	buf: AudioBuffer
	constructor(buf: AudioBuffer)
	static fromArrayBuffer(buf: ArrayBuffer, audio: AudioData): Promise<SoundData>
	static fromURL(url: string, audio: AudioData, fetchArrayBuffer): Promise<SoundData>
}
