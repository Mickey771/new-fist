<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewerFret

	//- Tooltip to show the intervals of the hovered fret
	VPopup.tooltip(
		:target="$refs.note || false"
		:boundary="isMobileDevice ? 'app' : 'fretboard-wrapper'"
		:is-open="showTooltip"
		)
		div.intervals
			div.intervals__item(
				v-for="interval of popupInfos"
				:key="`interval--${number}--${string + 1}--${interval.value}`"
				)
				div.intervals__item__dot(
					v-for="seq of interval.sequences"
					:key="`dot--${seq.index}`"

					:style="{ backgroundColor: seq.color }"
					)
				p.intervals__item__text {{ interval.name }}

	div.fret(
		v-mods=`{ 
			isOpenString, isStartingFret, isFirstFret, isOnLastString, 
			isFretboardVertical, isFretboardFlippedHor, isFretboardFlippedVert, 
		}`
		@click="toggleStringVisibleIfOpen"
	)

		div.fret__inlay(v-if="isShowingInlay")

		span.fret__note(
			ref="note"

			v-mods=`{ 
				isActive, isHighlighted, isShowingNoteInfos, 
				isOpenString, 
				isFretboardVertical, isFretboardFlippedHor, isFretboardFlippedVert,
				isCrossed, useNoteImage
			}`
			:style="style"

			@mouseenter="showTooltip = isActive"
			@mouseleave="showTooltip = false"
		)
			img.note-img(src="note.webp", v-if="useNoteImage")
			span.in_fret_note(v-else)
				p.hand-drawn(v-html="infos")
				//- div.string-visible-icon
				//- 	font-awesome-icon(:icon="['fas', 'eye']")

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                                 from 'vuex-pathify'

import { notesNames, degrees, models }                 from '@/modules/music'
import { intervalsNames, intervalsShorthands } from '@/modules/music'
import { resolveNoteName }                     from '@/modules/notenames'
import { positionForFret }                     from '@/modules/background'

export default {
	name: 'FretboardViewerFret',

	props: {
		string: {
			type: Number,
			required: true,
		},
		number: {
			type: Number,
			required: true,
		},
		note: {
			type: String,
			required: true,
		},
		sequences: {
			type: Array,
			required: true,
		},
		displayedInfos: {
			type: String,
			required: true,
			validator: v => ['none', 'name', 'degree', 'interval'].includes(v)
		},
		isHighlighted: {
			type: Boolean,
			default: false,
		},
		isOnLastString: {
			type: Boolean,
			default: false,
		},
		isShowingInlay: {
			type: Boolean,
			default: false,
		},
		isFretboardVertical: {
			type: Boolean,
			default: false,
		},
		isFretboardFlippedHor: {
			type: Boolean,
			default: false,
		},
		isFretboardFlippedVert: {
			type: Boolean,
			default: false,
		},
		fretMin: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			showTooltip: false,
		}
	},

	computed: {
		useNoteImage() {
			// Flip this flag to toggle between note text and images.
			// Note images are currently a preview feature,
			// and are not expected to work properly yet.
			return false;
		},
		// Information to display in popup. Usually intervals.
		popupInfos() {
			if (this.displayedInfos === 'interval') {
				// Already displaying intervals. Instead, we'll display the note.
				const intervals = this.intervals;
				return intervals.map( interval => ({...interval, name: this.note}));
			}
			else {
				return this.intervals;
			}
		},
		intervals() {
			// Make a list of intervals, each with the list of sequences that contain them
			const intervals = Object.values(this.sequences.reduce((list, seq) => {
				// If the interval is already in the list
				if (seq.interval in list) {
					list[seq.interval].sequences.push(seq.index);
				// If the interval is not in the list
				} else {
					list[seq.interval] = {
						name:      intervalsNames[seq.interval],
						value:     seq.interval,
						sequences: [{index:seq.index, color: seq.sequence.color}],
					};
				}

				return list;
			}, {}));

			// Sort the intervals and their sequences to keep the same visual order
			intervals.sort((a, b) => a.value - b.value);
			intervals.forEach(interval => interval.sequences.sort());

			return intervals;
		},
		noteBg() {
			if (this.useNoteImage) return {};
			if (!this.isActive) return { 'background-color': 'var(--color--bg)' };

			// Build a solid gradient with the colors of every sequence the fret note belongs to
			const stripeWidth = Math.ceil(100 / this.sequences.length);

			const gradient    = [...this.sequences].reverse().map(
				(seq, index) => `${seq.sequence.color} ${index*stripeWidth}% ${(index + 1)*stripeWidth}%`
			);

			return { background: `linear-gradient(-45deg, ${gradient})` };
		},
		// TODO this bit becomes tricky because we must 
		position() {
			this.isLayoutLandscape;
			const {string,number,backgroundSize} = this;
			return positionForFret({string,number}, this.instrument, backgroundSize);
		},
		style() {
			return {...this.noteBg, ...this.position};
		},
		colors() {
			return this.displayedSequences.map(seq => seq.color);
		},
		/** Display some information about this note. 
		 *  That may be a note such as 'C#', or a degree such as 'b5'.
		 *  It may also be an interval. **/
		infos() {
			if (!this.isActive) return notesNames[this.note];

			switch (this.displayedInfos) {
				case 'name':     return resolveNoteName(
						this.note, 
						this.sequences[0]?.sequence?.tonality,
						modeForSequence(this.sequences[0].sequence),
						this.sequences[0]?.sequence?.model
					);
				case 'degree':   return degrees[this.sequences[0].interval];
				case 'interval': return intervalsShorthands[this.sequences[0].interval];
				default:         return '';
			}
		},
		isActive() {
			return (
				this.sequences.length > 0 
				&& this.enabledStrings[this.string]
			);
		},
		isOpenString() {
			return this.number == 0;
		},
		isStartingFret() {
			return this.number == this.fretMin && this.number > 0;
		},
		isFirstFret() {
			return this.number == 1;
		},
		isShowingNoteInfos() {
			return this.displayedInfos != 'none';
		},
		isCrossed() {
			return this.isOpenString && !this.enabledStrings[this.string];
		},

		...get([
			'isMobileDevice',
			'isLayoutLandscape',
			'backgroundSize',
			'sequences/displayedSequences',
			'fretboard/enabledStrings',
			'fretboard/instrument'
		]),
	},

	methods: {
		toggleStringVisibleIfOpen() {
			if (this.isOpenString) {
				const newEnabledStrings = this.enabledStrings.slice();
				newEnabledStrings[this.string] = !newEnabledStrings[this.string];

				this.$store.commit('fretboard/enabledStrings', newEnabledStrings);
			}
		}
	}
}

function modeForSequence(sequence) {
	return models[sequence.model].mode;
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.fret.is-open-string .fret__note {
	cursor: pointer;
}

.fret {
	pointer-events: none;
	position: absolute;
	top: 0;
	left: 0;

	height: 100%;
	width: 100%;

	border-width: 0;
	border-style: solid;
	border-color: var(--color--border);

	&.is-fretboard-vertical {
		// Size
		//&.is-on-last-string            { width: 0; }
		//&:not(.is-on-last-string)      { width: layout.$fret-width; }

		// Fret bar
		&.is-fretboard-flipped-vert {
			&:not(.is-open-string) { border-top-width:    layout.$fretbar-thickness; }
			&.is-starting-fret     { border-bottom-width: layout.$fretbar-thickness; }
			&.is-first-fret        { border-bottom-width: layout.$nut-thickness;     }
		}

		&:not(.is-fretboard-flipped-vert) {
			&:not(.is-open-string) { border-bottom-width: layout.$fretbar-thickness; }
			&.is-starting-fret     { border-top-width:    layout.$fretbar-thickness; }
			&.is-first-fret        { border-top-width:    layout.$nut-thickness;     }
		}
	}

	&:not(.is-fretboard-vertical):not(.is-on-last-string) {
		// Size
		height: layout.$fret-width;

		// Fret bar
		/*
		&.is-fretboard-flipped-hor {
			&:not(.is-open-string) { border-left-width:   layout.$fretbar-thickness; }
			&.is-starting-fret     { border-right-width:  layout.$fretbar-thickness; }
			&.is-first-fret        { border-right-width:  layout.$nut-thickness;     }
		}

		&:not(.is-fretboard-flipped-hor) {
			&:not(.is-open-string) { border-right-width:  layout.$fretbar-thickness; }
			&.is-starting-fret     { border-left-width:   layout.$fretbar-thickness; }
			&.is-first-fret        { border-left-width:   layout.$nut-thickness;     }
		}
		*/
	}
}

.fret__note {
	pointer-events: all;
	position: absolute;
	z-index: 10;
	@include center-content;

	@include circle(layout.$note-size);

	font-weight: bold;

	color: transparent;

	opacity: 0;

	transition: opacity 200ms, filter 200ms, border-radius 200ms;

	/**
	 * Display
	 */
	&.is-active {
		opacity: 1;

		&:hover {
			filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.4));
		}

		&.is-highlighted        { border-radius: 0; }
		&.is-showing-note-infos { color: var(--color--text--inverted); }
	}

	&:not(.is-active) {
		border: 2px dashed var(--color--border);

		&:hover,
		&.is-open-string {
			color: var(--color--text);
			opacity: 1;
		}
	}

	/**
	 * Position
	 */
	&.is-fretboard-vertical {
		&.is-fretboard-flipped-vert {
			right: 0;

			&.is-open-string {
				bottom: 0;
				transform: translateX(50%);
			}

			&:not(.is-open-string) {
				top: 50%;
				transform: translate(50%, -50%);
			}
		}

		&:not(.is-fretboard-flipped-vert) {
			left: 0;

			&.is-open-string {
				top: 0;
				transform: translateX(-50%);
			}

			&:not(.is-open-string) {
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}

	/* stylelint-disable-next-line no-descending-specificity */
	&:not(.is-fretboard-vertical) {
		&.is-open-string {
			transform: translateY(-50%);

			&.is-fretboard-flipped-hor       { right: 0; }
			&:not(.is-fretboard-flipped-hor) { left:  0; }
		}

		&:not(.is-open-string) {
			transform: translate(-50%, -50%);

			&.is-fretboard-vertical          { top:  50%; }
			&:not(.is-fretboard-vertical)    { left: 50%; }
		}
	}
}

.fret.use-note-image {
	background-color: transparent;
}

// Hide inlays because background image already has them.
/*
.fret__inlay {
	@include center-position;
	@include circle(15px);

	background-color: var(--color--bg--highlight);
}
*/

.tooltip {
	padding: 8px;

	color: var(--color--bg--tooltip);
	background-color: var(--color--bg--tooltip);
}

.intervals {
	display: flex;
	@include space-children-h(10px);
}

.intervals__item {
	display: flex;
	align-items: center;
	@include space-children-h(5px);
}

.intervals__item__dot {
	@include circle(10px);
	flex: 0 0 auto;
}

.intervals__item__text {
	color: white;
}

.in_fret_note {
	position: relative;
	color: white;
	@include outline-text(2px);
	-webkit-text-stroke: 1px;
}

.string-visible-icon {
	position: absolute;
	top: -20px;	
	left: 0;

	background-color: var(--color-bg);	
}

.is-crossed {
     background: 
         linear-gradient(to top left,
             rgba(0,0,0,0) 0%,
             rgba(0,0,0,0) calc(50% - 0.8px),
             red 50%,
             rgba(0,0,0,0) calc(50% + 0.8px),
             rgba(0,0,0,0) 100%),
         linear-gradient(to top right,
             rgba(0,0,0,0) 0%,
             rgba(0,0,0,0) calc(50% - 0.8px),
             red 50%,
             rgba(0,0,0,0) calc(50% + 0.8px),
             rgba(0,0,0,0) 100%);
}

.note-img {
	width: 2em;
}

</style>
<!--}}}-->
