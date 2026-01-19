import {html, LitElement, PropertyValues} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin, {
	type Region,
} from 'wavesurfer.js/dist/plugins/regions.js';

const regions = RegionsPlugin.create();

@customElement('waveform-element')
export class WaveformElement extends LitElement {
	@state() video: HTMLVideoElement | undefined;

	@query('#container') containerElement!: HTMLDivElement;

	wavesurfer!: WaveSurfer;

	updated(changed: PropertyValues<this>) {
		if (changed.has('video')) {
			if (this.video) {
				this.wavesurfer = WaveSurfer.create({
					container: this.containerElement,
					media: this.video,
					minPxPerSec: 300,
					// dragToSeek: true,
					// normalize: true,
					autoCenter: true,
					hideScrollbar: true,
					plugins: [regions],
				});
			} else {
				this.containerElement.innerHTML = '';
			}
		}
	}

	render() {
		return html`<div id="container"></div>`;
	}

	#replayRegion!: Region;
	addRegion(start: number, end: number) {
		return (this.#replayRegion = regions.addRegion({
			start,
			end,
		}));
	}
	updateRegion(start: number, end: number) {
		return this.#replayRegion.setOptions({start, end});
	}
}

export const waveformElement = new WaveformElement();
