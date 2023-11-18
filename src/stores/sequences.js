import Vue                  from 'vue'

import { getVuexState }     from './vuex-plugin-save-state'

import { MAX_NB_SEQUENCES } from '@/modules/constants'
import { SEQ_COLORS }       from '@/modules/constants'
import { isObject, mapObjectToObject }         from '@/modules/object'
import { notesNames } from '@/modules/music'

/**
 * State
 */
const model = {
	sequences: {
		default: [],
		validator: v => Array.isArray(v) && v.every(item => isObject(item)),
	},
};
const state = getVuexState(model);

/**
 * Getters
 */
const getters = {
	displayedSequences: state => [].concat(state.sequences.find(seq => seq.isFocused) || state.sequences.filter(seq => seq.isVisible)),
};

/**
 * Mutations
 */
const mutations = {
	add(state) {
		addSequence(state);
	},
	duplicate(state, index) {
		addSequence(state, state.sequences[index]);
		// Assign a new ID to the duplicated sequence.
		state.sequences[state.sequences.length-1].id = Math.random();
	},
	update(state, params) {
		Vue.set(state.sequences[params.index], params.prop, params.value);
		if (params.prop === 'model') {
			// Changing the model resets the position.
			// This avoids discrepancies when switching between
			// models that do not share the selected position.
			Vue.set(state.sequences[params.index], 'position', 0);
		}
	},
	toggleFocus(state, index) {
		state.sequences.forEach((seq, i) => Vue.set(seq, 'isFocused', i == index && !seq.isFocused));
	},
	hideAll(state) {
		state.sequences.forEach(seq => Vue.set(seq, 'isVisible', false));
	},
	remove(state, index) {
		state.sequences.splice(index, 1);

		// Disable showing intersections if there is only one sequence left
		if (state.sequences.length == 1)
			Vue.set(state.sequences[0], 'isIntersected', false);
	},
	removeAll(state) {
		state.sequences = [];
	}
};

/**
 * Helpers
 */
function addSequence(state, params = {}) {
	// Limit the total number of sequences
	if (state.sequences.length >= MAX_NB_SEQUENCES) return;

	state.sequences.push({
		// Give the sequence a "unique" ID
		id:                  Math.random(),

		// Merge the provided parameters with the defaults
		model:               'min5',
		tonality:            'A',
		position:            0,

		// Map each note name to a boolean representing whether
		// the note is in our custom sequence.
		customSequence: mapObjectToObject(
			notesNames,
			// Default to a scale which contains no notes.
			() => false
		),

		// If position===-1, then use customPosition as the start/end
		// fret bounds.
		customFretBounds: [0,4], // Default to an open position.

		...params, // Everything after here is forcefully reset for the clone.

		// Always reset the display parameters
		isVisible:           true,
		isFocused:           false,
		isIntersected:       false,
		highlightedInterval: null,

		// Find the first color available
		color:               SEQ_COLORS.find(
			color => state.sequences.every(seq => seq.color != color)
		),
	});
}

export default { namespaced: true, model, state, getters, mutations }
