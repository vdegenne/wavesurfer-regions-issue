import '@material/web/button/filled-button.js';
import {html, LitElement, TemplateResult} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import styles from './styles.css.js';
import './waveform-element.js';
import {waveformElement} from './waveform-element.js';

interface Action {
	title: string;
	before?: string | TemplateResult;
	after?: string | TemplateResult;
	fct: () => void | Promise<void>;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@customElement('main-view')
export class MainView extends LitElement {
	@state() step = 0;
	@state() time = 0;
	@state() inaction = false;

	@query('video') video!: HTMLVideoElement;

	#actions: Action[] = [
		{
			title: 'Play video (2s) + pause',
			after: 'Just to go somewhere in the video',
			fct: async () => {
				this.video.play();
				await sleep(2000);
				this.video.pause();
			},
		},
		{
			title: 'Add region (1s)',
			fct: async () => {
				waveformElement.addRegion(this.time, this.time + 1);
			},
		},
		{
			title: 'Play video (2s) + pause + waiting a little bit (4s)',
			after: 'It fails more often if we wait a bit after the intial pause.',
			fct: async () => {
				this.video.play();
				await sleep(2000);
				this.video.pause();
				await sleep(4000);
			},
		},
		{
			title: 'Trying to update the same region with current time + 1s',
			before: html`Now when we try to update the region it
				<b>sometimes</b> fails.<br /> `,
			fct: async () => {
				waveformElement.updateRegion(this.time + 0.01, this.time + 1);
			},
		},
		{
			title: 'Resume the video',
			before: html`If the region appeared the demo failed (refresh the page to
				try again). <br />
				However if the region is not here it's an issue. But it re-appears if we
				resume the video.`,
			fct: async () => {
				this.video.play();
				await sleep(1000);
				this.video.pause();
			},
		},
	];

	static styles = styles;

	render() {
		return html`
			<div class="flex">
				<div style="width:600px">
					<video
						src="./slow_motion_dog_run.mp4"
						class="w-full"
						@timeupdate=${() => {
							this.time = this.video.currentTime;
						}}
						@loadedmetadata=${() => {
							waveformElement.video = this.video;
						}}
					></video>
					${waveformElement}
				</div>
				<div class="flex-1 flex-col" style="padding:12px;gap:24px;">
					${this.#actions.map((action, i) => {
						return html`<!-- -->
							<div
								class="flex-col"
								style="gap:12px;opacity:${i === this.step ? '1' : '0.3'}"
							>
								${action.before
									? html`<div style="padding-left:12px;">${action.before}</div>`
									: null}
								<div>
									<md-filled-button
										@click=${() => this.#executeAction(action)}
										?disabled=${this.inaction || i !== this.step}
									>
										${action.title}
									</md-filled-button>
								</div>
								${action.after
									? html`<div style="padding-left:12px;">${action.after}</div>`
									: null}
							</div>
							<!-- -->`;
					})}
				</div>
			</div>
		`;
	}

	async #executeAction(action: Action) {
		this.inaction = true;
		await action.fct();
		this.step++;
		this.inaction = false;
	}
}
