import { isDataURL, dataURLToArrayBuffer } from "../utils"
import { AudioData } from "../types"

export class SoundData {
	buf: AudioBuffer

	constructor(buf: AudioBuffer) {
		this.buf = buf
	}

	static fromArrayBuffer(buf: ArrayBuffer, audio: AudioData): Promise<SoundData> {
		return new Promise((resolve, reject) =>
			audio.ctx.decodeAudioData(buf, resolve, reject),
		).then((buf: AudioBuffer) => new SoundData(buf))
	}

	static fromURL(url: string, audio: AudioData, fetchArrayBuffer): Promise<SoundData> {
		if (isDataURL(url)) {
			return SoundData.fromArrayBuffer(dataURLToArrayBuffer(url), audio)
		} else {
			return fetchArrayBuffer(url).then((buf) => SoundData.fromArrayBuffer(buf, audio))
		}
	}

}
