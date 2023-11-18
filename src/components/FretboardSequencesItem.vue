<!--{{{ Pug -->
<template lang="pug">

mixin extra-tools
	//- Focus
	VButton(
		text="Focus"
		icon="bullseye"

		v-show="nbSequences > 1"
		:is-active="isFocused"

		@click="$store.commit('sequences/toggleFocus', index)"
		)
	//- Show intersections only
	VButton(
		text="Intersect"
		:icon="['fas', 'cross']"

		v-show="nbSequences > 1"
		:is-active="isIntersected"

		@click="update('isIntersected', !isIntersected)"
		)
	//- Duplicate
	VButton(
		text="Duplicate"
		icon="copy"

		:is-disabled="nbSequences == MAX_NB_SEQUENCES"

		@click="$store.commit('sequences/duplicate', index)"
		)

div.FretboardSequencesItem
	//- Infos bar (mobile only)
	div.mobile-info-bar(
		v-if="isMobileDevice"

		:style="{ backgroundColor: color }"
		@click.left="isOpen = !isOpen"
		)
		p {{ infos }}
		font-awesome-icon.mobile-info-bar__chevron(:icon="['fas', isOpen ? 'chevron-up' : 'chevron-down']")

	//- Settings & tools
	transition(name="fade"): div.settings(v-show="isOpen || !isMobileDevice")

		//----------------------------------------------------------------------
		//- Properties
		//----------------------------------------------------------------------
		div.properties
			div.dot(
				v-if="!isMobileDevice"
				:style="{ backgroundColor: color }"
				)
			VPopupMenu(
				v-if="!isMobileDevice"
				icon="paint-roller"
			)
				div.dot.click(
					v-for="color of SEQ_COLORS"
					:style="{ backgroundColor: color, margin: '0.5em'  }"
					@click="() => changeColor(color)"
					)

			//- Tonality
			VSelect(
				:value="tonality"
				:options="tonalities"
				:is-contained="isMobileDevice"

				@change="v => update('tonality', v)"
				)
			//- Model
			VSelect(
				:value="model"
				:options="modelOptions"
				:label-formatter="(value, label) => `${label} ${isArpeggio(value) ? 'arp.' : 'scale'}`"
				:is-contained="isMobileDevice"

				@change="v => update('model', v)"
				)
			//- Position
			VSelect(
				:value="position"
				:options="positions"
				:is-contained="isMobileDevice"
				:resort-options="true"

				@change="v => update('position', parseInt(v, 10))"
				)

		//----------------------------------------------------------------------
		//- Intervals
		//----------------------------------------------------------------------
		div.intervals
			FretboardSequencesItemInterval(
				v-for="interval of intervals"
				:key="`sequence--${index}--interval--${interval.value}`"

				v-bind="interval"
				:is-selected="highlightedInterval == interval.value"

				@update-interval="v => update('highlightedInterval', v)"
				)

		//----------------------------------------------------------------------
		//- Tools
		//----------------------------------------------------------------------
		div.tools(v-mods="{isMobileDevice}")
			//- Show/Hide
			VButton(
				:text="isVisible ? 'Hide' : 'Show'"
				:icon="isVisible ? 'eye' : 'eye-slash'"
				is-flipped

				@click="update('isVisible', !isVisible)"
				)

			//- Extra tools
			template(v-if="isMobileDevice || isWideScreen"): +extra-tools
			template(v-else): VPopupMenu(icon="ellipsis"): div.tools__extra: +extra-tools

			//- Remove
			VButton(
				text="Remove"
				icon="circle-xmark"

				@click="$store.commit('sequences/remove', index)"
				)

	CustomScaleNotes(:index="index")

	CustomFretRange(:index="index")


</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                        from 'vuex-pathify'

import { MAX_NB_SEQUENCES, NB_FRETS, SEQ_COLORS } from '@/modules/constants'
import { models, notes, notesNames }  from '@/modules/music'
import { modelOptions }               from '@/modules/models'
import { 
	intervalsForSequence, formatPositionNumber
}                                     from '@/modules/intervals'
import { resolveNoteName }            from '@/modules/notenames'


import FretboardSequencesItemInterval from '@/components/FretboardSequencesItemInterval'
import CustomScaleNotes               from '@/components/CustomScaleNotes'
import CustomFretRange                from '@/components/CustomFretRange'

export default {
	name: 'FretboardSequencesItem',

	components: {
    FretboardSequencesItemInterval,
    CustomScaleNotes,
	CustomFretRange
},

	props: {
		index: {
			type: Number,
			required: true,
		},
		tonality: {
			type: String,
			required: true,
		},
		model: {
			type: String,
			required: true,
		},
		position: {
			type: Number,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		highlightedInterval: {
			type: Number,
			default: null,
		},
		isVisible: {
			type: Boolean,
			default: true,
		},
		isFocused: {
			type: Boolean,
			default: false,
		},
		isIntersected: {
			type: Boolean,
			default: false,
		},
		nbSequences: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			isOpen: false,
		}
	},

	computed: {
		infos() {
			return `${notesNames[this.tonality]} ${models[this.model].name} ${this.isArpeggio(this.model) ? 'arpeggio' : 'scale'}`;
		},
		sequence() {
			return this.sequences[this.index];
		},
		intervals() {
			const intervals = intervalsForSequence(this.sequence);
			return [0, ...intervals].map(interval => ({
				note:  resolveNoteName(
					notesNames[notes[(notes.indexOf(this.tonality) + interval) % notes.length]],
					this.sequence.tonality,
					models[this.sequence.model].mode,
					this.sequence.model
				),
				value: interval,
			}))
		},
		/** Does the selected model (scale/arpeggio interval pattern)
		 *  have (finger) positions provided?
		 */
		hasPositions() {
			return ('positions' in models[this.model]);
		},
		SEQ_COLORS() {
			return SEQ_COLORS;
		},
		/** Which text options are we displaying for positions? */
		positions() {
			const positions = {};
			positions[0] = 'whole';
			positions[-2] = 'open';
			for (let i=1; i<=NB_FRETS; ++i) {
				positions[i] = formatPositionNumber(i);
			}
			positions[-1] = 'custom';
			return positions;
		},
		tonalities() {
			return {
				'A': 'A',
				'Bb': 'A♯/B♭',
				'B': 'B',
				'C': 'C',
				'Db': 'C♯/D♭',
				'D': 'D',
				'Eb': 'D♯/E♭',
				'E': 'E',
				'F': 'F',
				'Gb': 'F♯/G♭',
				'G': 'G',
				'Ab': 'G♯/A♭'
			}
		},

		...get([
			'isMobileDevice',
			'isWideScreen',
		]),
		...get('fretboard', ['customTuning','tuning', 'instrument']),
		...get('sequences', ['sequences'])
	},

	created() {
		this.modelOptions     = modelOptions;
		this.MAX_NB_SEQUENCES = MAX_NB_SEQUENCES;
	},

	methods: {
		update(prop, value) {
			this.$store.commit('sequences/update', { index: this.index, prop, value });
		},
		isArpeggio(model) {
			return model.startsWith('arp-');
		},
		changeColor(color) {
			this.update('color', color);	
		}
	}
}

</script>
<!--}}}-->


<!--{{{ SCSS -->
<style lang="scss" scoped>

.dot {
	@include circle(10px);
	flex: 0 0 auto;

	&.dot.dot { margin-right: 20px; }
}

.mobile-info-bar {
	display: flex;
	justify-content: space-between;
	font-size: initial;

	padding: 16px 16px 16px 14px;

	color: var(--color--text);
}

.mobile-info-bar__chevron {
	font-size: 1.4rem;
}

.settings {
	@include mq($from: desktop) {
		display: flex;
		align-items: flex-start;
		@include space-children-h(40px);

		border-radius: 10px;
	}
}

.properties {
	@include mq($from: desktop) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		@include space-children-h(10px);

		flex: 0 0 auto;
	}
}

.intervals {
	display: grid;
	grid-auto-rows: auto;
	grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
	gap: 1px;

	@include mq($until: desktop) {
		// Fix for the box-shadow border hack
		margin-bottom: 1px;
	}

	@include mq($from: desktop) {
		grid-template-columns: repeat(auto-fill, 60px);
		align-content: center;
		gap: 10px;

		flex: 1 1 100%;
		align-self: stretch;
	}
}

.custom-scale-notes {
	font-size: 3rem;
}

.tools {

	@include mq($until: desktop) {
		display: grid;
		grid-auto-rows: auto;
		grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
		gap: 1px;

		// Fix for the box-shadow border hack
		//margin-bottom: 1px;
	}

	@include mq($from: desktop) {
		display: flex;
		@include space-children-h(10px);

		margin-bottom: 8px;

	}

	--color--text: var(--color-text-inverted);
	--color--bg--highlight: white;
}

.tools.is-mobile-device {
	// FIXME hacky fix that assumes dark theme.
	--color--text: white;
}

.tools__extra {
	@include center-column;
	@include space-children-v(10px);
}

.click {
	cursor: pointer;
}

</style>
<!--}}}-->
