<!--{{{ Pug -->
<template lang="pug">

div.FretboardViewer(
	v-mods="{ isShowingFretNbs }"
	)

	//- Frets
	FretboardViewerFret(
		v-for="(fret, index) of displayedFrets"
		:key="`fret--${fret.number}--${fret.string + 1}`"

		v-bind="fret"
		:displayed-infos="displayedInfos"

		:fret-min="fretMin"
		:is-on-last-string="fret.string + 1 == nbStrings"
		:is-showing-inlay="inlays.includes(`${fret.number}-${fret.string + 1}`)"

		:is-fretboard-vertical="isVertical"
		:is-fretboard-flipped-hor="isFlippedHor"
		:is-fretboard-flipped-vert="isFlippedVert"

		:style="(isFlippedHor && !isVertical) ? { gridArea: `${fret.string + 1} / -${fret.number + 2 - fretMin} / span 1 / span 1` } : null"
		)

	//- Strings
	div.string(
		v-for="(string, index) of strings"
		:key="`string--${index + 1}`"

		:style="string"
		)

	//- Fret numbers
	div.fret-number(
		v-for="(style, index) of fretNumbers"
		v-if="shouldDisplayFretNumber(index)"
		:key="`fret-number--${index+1}`"

		v-show="isShowingFretNbs"
		v-mods="{ isVertical }"
		:style="style"
	)
		p.fret-number__text.hand-drawn {{ index+1 }}

	PositionBracket(
		v-for="(positionBracket,index) of positionBrackets"
		:key="positionBracket.fretNumber"
		:fretNumber="positionBracket.fretNumber"
		:color="positionBracket.color"
		:flipY="index%2===1"
	)

	img.capo(
		v-if="capo>0"
		src="capo.webp"
		:style="capoStyle"
	)

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                  from 'vuex-pathify'

import { layout }               from '@/modules/layout'
import { instruments }          from '@/modules/music'
import { getFrets }             from '@/modules/fretboard2'
import { tuningNotes }          from '@/modules/tuning'
import { findBackground, positionForFretNumber, styleForCapo }       from '@/modules/background'


import FretboardViewerFret      from '@/components/FretboardViewerFret'
import PositionBracket from '@/components/PositionBracket'

export default {
	name: 'FretboardViewer',

	components: {
		FretboardViewerFret,
		PositionBracket
	},

	props: {
		isVertical: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		capoStyle() {
			const {backgroundSize,capo,instrument,isLayoutLandscape} = this;
			return styleForCapo({backgroundSize,capo,instrument,isLayoutLandscape});
		},
		grid() {
			let template = [...(this.fretMin == 0 ? [layout.openStringFretLength.px] : []), ...this.layout.map(track => `${track}fr`)];

			/**
			 * Invert the grid layout:
			 *  - when the fretboard is vertical (portait mode, e.g. on mobile) and "mirrored"
			 *  - when the fretboard is horizontal (desktop or mobile in landscape mode) and the fretting hand is flipped
			 */
			if (this.isVertical ? this.isFlippedVert : this.isFlippedHor) template.reverse();

			return {
				'grid-auto-flow': this.isVertical ? 'column' : 'row',
				[`grid-template-${this.isVertical ? 'rows'   : 'columns'}`]: template.join(' '),
			};
		},
		maxWidth() {
			// Limit the width of the fretboard in vertical mode
			return this.isVertical ? { width: `${(this.nbStrings - 1)*layout.fretWidth.int + this.fretNumbersPadding.int}px` } : {};
		},
		minLength() {
			/**
			 * The length of the fretboard must be so that the length
			 * of the smallest fret is equal or greater than a fixed minimum length
			 */
			const length = layout.minFretLength.int*(this.nbFrets / this.layout.slice(-1)[0]) + (this.fretMin == 0 ? layout.openStringFretLength.int : 0);

			return { [`min-${this.isVertical ? 'height': 'width'}`]: `${Math.ceil(length)}px` };
		},
		layout() {
			/**
			 * Compute the size of each fret so that:
			 *     - size(1) = 3/2
			 *     - size(n) = 1/2 (n = total number of frets)
			 *
			 * Which gives the following function:
			 *     f(x) = (3n - 1)/(2n - 2) - x/(n - 1)
			 */
			const n = this.nbFrets;
			const c = (3*n - 1)/(2*n - 2);

			// Don't include the open string fret in the flexible layout
			return [...Array(this.fretMin == 0 ? (this.nbFrets - 1) : this.nbFrets).keys()].map(i => c - i/(n - 1));
		},
		strings() {
			return [...Array(this.nbStrings).keys()].map(index => ({
				// Start & end
				[this.isVertical ? (this.isFlippedVert ? 'bottom' : 'top'   ) : (this.isFlippedHor ? 'right' : 'left' )]: this.fretMin == 0 ? layout.openStringFretLength.px : '0',
				[this.isVertical ? (this.isFlippedVert ? 'top'    : 'bottom') : (this.isFlippedHor ? 'left'  : 'right')]: 0,

				// Position
				[this.isVertical ? 'left': 'top']: `calc(calc(100% - ${this.fretNumbersPadding.px})*${index / (this.nbStrings - 1)})`,
				transform: this.isVertical ? `translateX(calc(${this.fretNumbersPadding.px} - 50%))` : 'translateY(-50%)',

				// Width
				[this.isVertical ? 'width' : 'height']: layout.stringThickness.px,
			}));
		},
		inlays() {
			// List the frets which can have an inlay (only the 12th is omitted)
			let frets = ['3', '5', '7', '9', '15', '17', '19', '21'];

			switch (this.nbStrings) {
				/**
				 * Bass, ukulele, guitar
				 * Single inlay in the middle + double inlay at the 12th fret
				 */
				case 4:  return ['12-1', '12-3', ...frets.map(f => `${f}-2`)];
				case 6:  return ['12-2', '12-4', ...frets.map(f => `${f}-3`)];

				/**
				 * Five-string banjo, seven-string guitar, mandolin, nine-, eleven- string guitar
				 * Double inlay (close for odd frets, spreaded for the 12th)
				 */
				case 5:  return ['12-1', '12-4', ...frets.map(f => `${f}-2`), ...frets.map(f => `${f}-3`)];
				case 7:  return ['12-2', '12-5', ...frets.map(f => `${f}-3`), ...frets.map(f => `${f}-4`)];
				case 8:  return ['12-2', '12-6', ...frets.map(f => `${f}-3`), ...frets.map(f => `${f}-5`)];
				case 9:  return ['12-2', '12-7', ...frets.map(f => `${f}-3`), ...frets.map(f => `${f}-6`)];
				case 11: return ['12-3', '12-8', ...frets.map(f => `${f}-4`), ...frets.map(f => `${f}-7`)];

				/**
				 * Ten-string guitar
				 * Double inlay for odd frets, triple for the 12th
				 */
				case 10: return ['12-2', '12-8', ...frets.map(f => `${f}-4`), ...frets.map(f => `${f}-6`), ['12-5']];
			}

			return [];
		},
		displayedInfos() {
			return (this.displayedSequences.length > 1) ? (this.isShowingNoteNames ? 'name' : 'none') : this.noteInfos;
		},
		displayedFrets() {
			return this.frets.filter(fret => this.fretMin <= fret.number && fret.number <= this.fretMax);
		},
		frets() {
			const frets = getFrets(this.displayedSequences, this.tuningNotes, this.capo, this.flipped);

			if (this.isVertical && this.isFlippedVert)
				frets.reverse();

			return frets;
		},
		// Returns information about how to display fret numbers.
		fretNumbers() {
			const background = findBackground(this.instrument);
			return (background.fretNumbers??[]).map(
				(_,idx) => positionForFretNumber(idx, this.instrument, this.backgroundSize)
			);
		},
		fretNumbersPadding() {
			return this.isShowingFretNbs ? layout.fretNumberWrapperSize : { int: 0, px: '0px' };
		},
		/** Should the order of the strings be inverted? */
		flipped() {
			/**
			 * Invert the order of the strings (the topmost becomes the bottommost, etc.) when:
			 *   - the fretboard is vertical + mirrored and the fretting hand is NOT flipped
			 *   - the fretboard is horizontal and is not "mirrored" (i.e. flipped vertically)
			 */
			return !(
				(this.isVertical && this.isFlippedVert && !this.isFlippedHor)
				|| this.isFlippedVert
			);
		},
		tuningNotes() {
			const {instrument,tuning,customTuning} = this;
			const notes = tuningNotes({instrument,tuning,customTuning});
			
			if (this.flipped) notes.reverse();
			return notes;
		},
		nbStrings() {
			return instruments[this.instrument].nbStrings;
		},
		nbFrets() {
			return this.fretMax - this.fretMin + 1;
		},
		fretMin() {
			return this.fretRange[0];
		},
		fretMax() {
			return this.fretRange[1];
		},
		positionBrackets() {
			if (this.isMobileDevice) {
				return [];
			}
			// Negative numbers are reserved for edge-case positions
			// such as "whole" or "open".
			const positionedSequences = this.displayedSequences.filter(
				sequence => sequence.position >= 0
			);
			const uniquePositionedSequences = [...new Map(
				positionedSequences.map(sequence => [sequence.position,sequence])
			).values()];

			uniquePositionedSequences.sort(
				(a,b) => a.position - b.position
			);

			const brackets = uniquePositionedSequences.map(
				sequence => ({
					fretNumber: sequence.position,
					color: sequence.color
				})
			);
			return brackets;
		},

		...get('sequences', [
			'displayedSequences'
		]),

		...get('fretboard', [
			'instrument',
			'tuning',
			'customTuning',
			'capo',
			'fretRange',

			'noteInfos',

			'isFlippedHor',
			'isFlippedVert',
			'isShowingFretNbs',
			'isShowingNoteNames',
		]),

		...get(['backgroundSize', 'isMobileDevice', 'isLayoutLandscape']),
	},

	methods: {
		shouldDisplayFretNumber(index) {
			const number = index + 1;
			return ![19,21,23,25].includes(number);
		}
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.FretboardViewer {
	display: grid;
	/*position: relative;*/
}

.string {
	position: absolute;

	background-color: var(--color--string);
}

.fret-number {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	font-size: 2em;

	&.is-vertical {
		align-items: center;
		justify-content: flex-start;

		//width: layout.$fret-number-wrapper-size;
	}

	&:not(.is-vertical) {
		align-items: flex-end;
		justify-content: center;

		//height: layout.$fret-number-wrapper-size;
	}
}

.fret-number__text {
	z-index: 1; // Ensure that fret number is displayed over top of capo.
	//color: var(--color--text--secondary);
	font-weight: 700;
	color: white;
	@include center-position;
	@include outline-text(1px);

}

@include mq($until: desktop) {
	@media (orientation: portrait) {
		.FretboardViewer {
			margin: auto;

			&.is-large-instrument {
				margin-bottom: 20px;
			}

			&:not(.is-large-instrument).is-showing-fret-nbs {
				// Shift the fretboard to keep it horizontally centered when fret numbers are displayed
				//transform: translateX(layout.$fret-number-wrapper-size / -2);
			}
		}
	}

	// Add a margin on the right side
	@media (orientation: landscape) {
		.FretboardViewer { padding-right: 20px; }
		.string          { margin-right:  20px; }
	}
}

// Disable string, fret visibility because 
// background image includes these things.
.string {
	visibility: hidden;
}
.fret {
	border-right-width: 0;
}

.capo {
	position: absolute;
	top: 0;
	left: 0;
	width: 3em;
	transform: translate(-50%,-50px);
	z-index: 1;
}

</style>
<!--}}}-->
