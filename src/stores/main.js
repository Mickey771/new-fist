import Vue                   from 'vue'
import Vuex                  from 'vuex'
import { make }              from 'vuex-pathify'
import { getVuexState }      from './vuex-plugin-save-state'
import { saveStatePlugin }   from './vuex-plugin-save-state'

import pathify               from '@/modules/pathify'
import { makeTogglers }      from '@/modules/pathify'
import { mapObjectToObject } from '@/modules/object'

import { layout }            from '@/modules/layout'
import sequences             from '@/stores/sequences'
import fretboard             from '@/stores/fretboard'
import { incrementPosition, decrementPosition } from '@/modules/position'
import { tuningNotes }       from '@/modules/tuning'

export const mediaQueries = {
	isMobileDevice:     window.matchMedia(`(max-width:            ${layout.mqBreakpointDesktop?.em})`),
	isTallScreen:       window.matchMedia(`(min-height: 500px)`),
	isWideScreen:       window.matchMedia(`(min-width:            ${layout.mqBreakpointWide?.em})`),
	isLayoutLandscape:  window.matchMedia('(orientation:          landscape)'),
	isSystemDarkModeOn: window.matchMedia('(prefers-color-scheme: dark)'),
}

/**
 * State
 */
const model = {
	darkModeSetting: {
		default: 'dark',
		validator: v => ['light', 'dark', 'system'].includes(v),
	},
	darkModeSystem: {
		saved: false,
		default: mediaQueries.isSystemDarkModeOn.matches,
	},
	...mapObjectToObject(mediaQueries, mq => ({
		saved: false,
		default: mediaQueries[mq].matches,
	})),
	backgroundSize: {
		saved: false,
		default: {width:0,height:0},
	}
};
const state = getVuexState(model);

/**
 * Getters
 */
const getters = {
	isDarkModeOn: state => (state.darkModeSetting == 'system' && state.darkModeSystem) || state.darkModeSetting == 'dark',
};

function displayedSequencesForState(state) {
	state = state.sequences;
	return [].concat(state.sequences.find(seq => seq.isFocused) || state.sequences.filter(seq => seq.isVisible))
}

/**
 * Mutations
 */
const mutations = {
	...make.mutations(state),
	...makeTogglers(state),

	incrementPosition(state) {
		Vue.set(
			displayedSequencesForState(state)[0], 'position', 
			incrementPosition(
				displayedSequencesForState(state)[0], tuningNotes(state.fretboard)
			)
		);
	},
	decrementPosition(state) {
		Vue.set(
			displayedSequencesForState(state)[0], 'position',
			decrementPosition(
				displayedSequencesForState(state)[0], tuningNotes(state.fretboard)
			)
		);
	}
};

/**
 * Instantiate the store
 */
Vue.use(Vuex);
export default new Vuex.Store(
{
	strict: process.env.NODE_ENV === 'development',

	plugins: [
		pathify.plugin,
		saveStatePlugin({
			...model,
			sequences: sequences.model,
			fretboard: fretboard.model,
		}, {
			namespace:           'fretboarder@3.1',
			savedByDefault:      true,
			clearStorageOnError: process.env.NODE_ENV === 'production',
		}),
	],

	modules: {
		sequences,
		fretboard,
	},

	state, getters, mutations,
});
