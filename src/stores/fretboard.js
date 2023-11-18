import { make }                      from 'vuex-pathify'
import { getVuexState }              from './vuex-plugin-save-state'

import { instruments, tuningsNames, tunings } from '@/modules/music'
import { makeTogglers }              from '@/modules/pathify'

/**
 * State
 */
const model = {
	instrument: {
		default: 'guitar',
		validator: v => (v in instruments),
	},
	tuning: {
		default: 'standard',
		validator: v => (v in tuningsNames),
	},
	customTuning: {
		default: ['E','A','D','G','B','E'],
		validator: v => Array.isArray(v)
	},
	/** Which strings are we displaying notes on? */
	enabledStrings: {
		default: [true,true,true,true,true,true],
		validator: v => Array.isArray(v)
	},
	capo: {
		default: 0,
		validator: v => typeof v == 'number' && v >= 0,
	},
	fretRange: {
		default: [0, 24],
		validator: v => Array.isArray(v) && v.length == 2,
	},
	noteInfos: {
		default: 'name',
		validator: v => typeof v == 'string' && ['none', 'name', 'degree', 'interval'].includes(v),
	},
	isShowingFretNbs: {
		default: false,
		validator: v => typeof v == 'boolean',
	},
	isShowingNoteNames: {
		default: true,
		validator: v => typeof v == 'boolean',
	},
	isFlippedHor: {
		default: false,
		validator: v => typeof v == 'boolean',
	},
	isFlippedVert: {
		default: false,
		validator: v => typeof v == 'boolean',
	},
};
const state = getVuexState(model);

/**
 * Mutations
 */
const mutations = {
	...make.mutations(state),
	...makeTogglers(state),

	// Reset the tuning to the default when switching between different instruments
	instrument(state, value) {
		state.tuning     = 'standard';
		state.instrument = value;
		state.customTuning = tunings[state.instrument]['standard'].slice();
		state.enabledStrings = new Array(instruments[state.instrument].nbStrings).fill(true);
	},
};

export default { namespaced: true, model, state, mutations }
