<!--{{{ Pug -->
<template lang="pug">



div.root(v-mods="{isLayoutLandscape,isMobileDevice}")

	div(:style="colorscheme")
		//----------------------------------------------------------------------	
		//- Header
		//----------------------------------------------------------------------
		header.header(v-mods="{isMobileDevice}")
			//- Logo
			div.header__logo(v-show="!isMobileDevice || subpage == 'fretboard'")
				font-awesome-icon.logo__icon(
					:icon="['fas', instrumentIcon]"
					v-mods="{ isUkulele: instrument == 'ukulele' }"
					)
				h1.logo__text Fish Frets {{ version }}

			//- Settings (desktop)
			FretboardSettings(v-if="!isMobileDevice")

			//- Sub-pages links (mobile)
			nav.header__sublinks(v-if="isMobileDevice")
				div.sublinks__item(v-show="isMobileDevice && subpage == 'fretboard'" @click.left="subpage = 'sequences'"): font-awesome-icon(:icon="['fas', 'list']")
				div.sublinks__item(v-show="isMobileDevice && subpage == 'fretboard'" @click.left="subpage =  'settings'"): font-awesome-icon(:icon="['fas', 'gear']")
				div.sublinks__item(v-show="isMobileDevice && subpage != 'fretboard'" @click.left="subpage = 'fretboard'"): font-awesome-icon(:icon="['fas', 'arrow-left']")

			//- Sub-pages headers
			h1.header__subpage-header(v-show="isMobileDevice && subpage == 'sequences'") Scales & arpeggios
			h1.header__subpage-header(v-show="isMobileDevice && subpage ==  'settings'") Settings


	

	div.App#app(:style="colorscheme")

		div.instrument-background-scroll(
			v-show="!isMobileDevice || subpage == 'fretboard'"
			v-mods="{ isMobileDevice, isLayoutLandscape }"
		)
			div.bg-and-frets(
				v-mods="{isMobileDevice, isLayoutLandscape, isShortScreen}"
			)
				img.background-background(
					src="BG.webp"
				)
				img.instrument-background(
					:src="backgroundImage"
					ref="backgroundImageRef"
					v-mods="{isLayoutLandscape}"
				)
				//- Fretboard
				div(
					v-mods="{ isLargeInstrument }"
				)
					FretboardViewer(
						:is-vertical="isMobileDevice && !isLayoutLandscape"
						v-mods="{ isLargeInstrument }"
						)

				div.scale-titles.hand-drawn(v-if="!isMobileDevice")
					div.scale-texts
						div.scale-text(v-for="scaleText of scaleTexts") 
							div.dot(
								v-if="scaleText.color !== undefined"
								:style="{background: scaleText.color}"
							)
							span {{ scaleText.text }}
					div.strings-text {{ stringsText }}

		PositionNudgers(v-if="!isMobileDevice")

		div.header-spacer(
			v-if="shouldDisplayHeaderSpacer"
			style="height:4rem"
		)
		
		

		//----------------------------------------------------------------------
		//- Body
		//----------------------------------------------------------------------
		div#canvas-wrapper(v-show="false")


		//- Settings (mobile)
		FretboardSettings(v-if="isMobileDevice && subpage == 'settings'")

		CustomTuning(v-if="!isMobileDevice")

		//- Scales & arpeggios
		div: FretboardSequences(v-show="!isMobileDevice || subpage == 'sequences'")

		//----------------------------------------------------------------------
		//- Footer
		//----------------------------------------------------------------------
		footer.footer(v-if="!isMobileDevice"): nav.nav

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }               from 'vuex-pathify'

import { colorscheme }       from '@/modules/colorscheme'
import { mapObjectToObject } from '@/modules/object'
import { instruments, models }       from '@/modules/music'
import { nameModel }         from '@/modules/name_scale'
import { enabledStringsText} from '@/modules/enabled_strings'
import { tuningNotes }       from '@/modules/tuning'
import { capitalizeWords }   from '@/modules/text'
import { resolveNoteName }           from '@/modules/notenames'
import { findBackgroundImage } from '@/modules/background'

import { mediaQueries }      from '@/stores/main'

import FretboardSettings     from '@/components/FretboardSettings'
import FretboardViewer       from '@/components/FretboardViewer'
import FretboardSequences    from '@/components/FretboardSequences'
import CustomTuning          from '@/components/CustomTuning'
import PositionNudgers       from '@/components/PositionNudgers'

const packageJson = require('@/../package.json');

export default {
	name: 'App',

	components: {
		FretboardSettings,
		FretboardViewer,
		FretboardSequences,
		CustomTuning,
		PositionNudgers
	},

	data() {
		return {
			mailto:  '',
			subpage: 'fretboard',
		}
	},

	computed: {
		
		scaleTexts(){
			if (this.displayedSequences.length > 2) return [];

			let texts = this.displayedSequences.map(
				sequence => ({ text: this.scaleText(sequence), color: sequence.color })
			)
			if (texts.length === 2) {
				texts = [ texts[0], {text:'&'}, texts[1]];
			}
			return texts;
		},
		shouldDisplayHeaderSpacer() {
			return this.isMobileDevice && this.subpage != 'fretboard'
		},
		colorscheme() {
			// The colorscheme object contains 
			// [lightscheme,darkscheme] tuples,
			// where both are CSS colors.
			// Select the correct color for each property dynamically.
			return mapObjectToObject(colorscheme, (varName, values) => values[this.isDarkModeOn ? 1 : 0]);
		},
		instrumentIcon() {
			switch (this.instrument) {
				case 'bass':     return 'guitar-electric';
				case 'banjo-4':  return 'banjo';
				case 'banjo-5':  return 'banjo';
				// Mandolin icon is not part of the free set.
				case 'mandolin': return 'guitar';
				default:         return 'guitar';
			}
		},
		isLargeInstrument() {
			return instruments[this.instrument].nbStrings > 7;
		},
		version() {
			return `v${packageJson.version}`;
		},
		isShortScreen() {
			return !this.isTallScreen;
		},
		stringsText() {
			return enabledStringsText(
				[...this.enabledStrings].reverse(), 
				tuningNotes({
					instrument: this.instrument,
					tuning: this.tuning,
					customTuning: this.customTuning
				})
			);
		},

		backgroundImage() {
			return findBackgroundImage(this.instrument, this.isLayoutLandscape);
		},

		...get('fretboard', [
			'instrument',
			'tuning',
			'customTuning',
			'enabledStrings'
		]),


		...get('sequences', ['sequences', 'displayedSequences']),

		...get([
			'isDarkModeOn',
			'isMobileDevice',
			'isTallScreen',
			'isLayoutLandscape',
		]),
	},

	created() {
		this.feedbackMail = {
			subject: encodeURIComponent("Feedback on Fretboarder 🎸"),
			body:    encodeURIComponent("Thank you for providing feedback on Fretboarder!\nIf you wish to report a bug, please specify your OS and browser to help us resolve it faster.\n----------\n\n"),
		};

		// Add a sequence if there is none at startup
		if (this.$store.state.sequences.sequences.length == 0)
			this.$store.commit('sequences/add');
	},

	mounted() {
		// Listen to any changes on the device type and layout orientation
		Object.keys(mediaQueries).forEach(mq => mediaQueries[mq].addListener(this[`update.${mq}`]));

		const ref = this.$refs.backgroundImageRef;

		window.ref = ref;
		const store = this.$store;

		const observer = new ResizeObserver((_entries) => {
			//const entry = entries[0];
			store.commit('backgroundSize', {width:ref.width, height:ref.height});
		});
		observer.observe(ref)
	},

	destroyed() {
		// Clear event listeners
		Object.keys(mediaQueries).forEach(mq => mediaQueries[mq].removeListener(this[`update.${mq}`]));
	},

	methods: {
		// Add all kinds of media queries as methods.
		...Object.fromEntries(Object.keys(mediaQueries).map(mq => [`update.${mq}`, function(event) { return this.$store.commit(mq, event.matches); }])),
		// Index is sequence index.
		scaleText(sequence) {
			const modelName = nameModel(sequence.model);

			// const modelStrings = enabledStringsText(
			// 	[...this.enabledStrings].reverse(), 
			// 	tuningNotes({
			// 		instrument: this.instrument,
			// 		tuning: this.tuning,
			// 		customTuning: this.customTuning
			// 	})
			// );

			const tonality = resolveNoteName(
				sequence.tonality, sequence.tonality,
				models[sequence.model].mode,
				sequence.model
			);
			return capitalizeWords(`${tonality} ${modelName}`);
		},
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

/**
 * Layout
 * -----------------------------------------------------------------------------
 */

.root.is-mobile-device.is-layout-landscape {
	overflow-y: hidden;
	height: 100vh;
}

.App {
	display: flex;
	flex-direction: column;
	width: 100%;

	flex: 1 1 auto;
	background-color: var(--color--bg);
	min-height: 100vh;
}

.fretboard-wrapper {
	@include mq($until: desktop) {
		@media (orientation: portrait) {
			margin: 20px 0;

			&.is-large-instrument {
				//overflow-x: scroll;

				margin: 0;
				padding: 20px;
			}
		}

		@media (orientation: landscape) {
			//overflow-x: scroll;

			padding: 40px 20px;
		}
	}

	@include mq($from: desktop) {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		//overflow-x: auto;

		min-height: 33vh;

		margin-bottom: 60px;
		padding: 70px 0 40px;
	}
}

/**
 * Header
 * -----------------------------------------------------------------------------
 */

.header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	padding: 1rem;

	display: flex;
	align-items: center;
	justify-content: space-between;

	@include mq($until: desktop) {
		background-color: var(--color--bg--tooltip);
		//background-color: red;
	}
	

	@include mq($from: desktop) {
		margin-bottom: 40px;
	}
}

.header.is-mobile-device {
	position:static;
}

.header__logo {
	display: flex;
	align-items: center;
	@include space-children-h(8px);

	padding: 10px;

	border-radius: 6px;

	//color: var(--color--text);
	color: white;

	@include mq($from: desktop) {
		@include space-children-h(5px);

		padding: 4px 6px;

		/*color: var(--color--bg);*/
		background-color: #171e29;

		&:hover {
			background-color: var(--color--hover);
		}
	}
}

.logo__icon {
	font-size: 20px;

	&.is-ukulele { font-size: 14px; }
}

.logo__text {
	font-size: 20px;
	font-weight: bold;

	transition: color 200ms;

	@include mq($from: desktop) {
		font-size: 24px;
	}
}

.header__sublinks {
	display: flex;
	justify-content: flex-end;

	padding: 10px;
}

.sublinks__item {
	@include center-content;
	@include circle(36px);

	font-size: 18px;

	border: 1px solid var(--color--text);

	color: var(--color--text);

	cursor: pointer;

	&:first-child {
		margin-right: 10px;
	}
}

.header__subpage-header {
	flex: 1 1 100%;

	font-size: 18px;
	font-weight: bold;

	color: var(--color--text);

	
}

/**
 * Footer
 * -----------------------------------------------------------------------------
 */

.footer {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	flex: 1 1 100%;

	margin-top: 40px;
}

.dot {
	@include circle(14px);
	display: inline-block;
	margin-right: 10px;
}

.header {
	// Ensure that header is displayed over absolutely-positioned fret notes.
	z-index: 100; 
}

.nav {
	display: flex;
	justify-content: flex-end;
	@include space-children-h(20px);
}

.nav__link {
	display: flex;
	align-items: center;
	@include space-children-h(6px);

	font-size: 1.35rem;

	color: var(--color--text--secondary);

	cursor: pointer;

	&:hover {
		color: var(--color--hover);
	}
}

.nav__link__text {
	cursor: pointer;
}

.link-support    { color: var(--color--red);    }
.link-tgld:hover { color: var(--color--orange); }

.instrument-background {
	// Display over water backround, but still take up space in layout.
	z-index: 1;
	position: relative;

	width: 100%;

	@include mq($from:desktop) {
		width: 1846px;
	}

	
}

// Water background behind instrument.
.background-background {
	width: 100%;
	position: absolute;

	@include mq($from:desktop) {
		width: 1846px;
	}

	
}

.instrument-background.is-layout-landscape {
	width: 1846px;
}

.instrument-background-scroll {
	overflow-x: hidden;

	@include mq($from:desktop) {
		overflow-x: auto;
	}
	overflow-y:hidden;
}

.instrument-background-scroll.is-mobile-device {
	//scale:	 2;
	font-size: 0.5em;
}

.instrument-background-scroll.is-mobile-device.is-layout-landscape {
	font-size: 1em;
	overflow-x: auto;
}

.bg-and-frets {
	position: relative;
}

.bg-and-frets.is-layout-landscape.is-short-screen {
	transform: scale(0.5) translateY(-50%) translateX(-50%);
}

// TODO only display on desktop.
.scale-titles {
	position: absolute;
	// Placeholder.
	top: 30px;
	left: 300px;
	font-size: 5em;
	color: white;
	font-weight: 700;
	@include outline-text(1px);
}

.scale-texts {
	display: flex;
	flex-direction: row;
}

.strings-text {
	text-align: center;
}

.scale-text {
	padding-left: 1em;
	padding-right: 1em;
}

</style>
<!--}}}-->

<!--{{{ Global styles -->
<style lang="scss">

@use "@/styles/global";

</style>
<!--}}}-->
