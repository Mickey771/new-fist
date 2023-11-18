
/**
 *   __T__T__T__          _______              __   __                        __
 *  /  @  @  @  \‖=======|    ___|.----.-----.|  |_|  |--.-----.---.-.----.--|  |.-----.----.=======
 *  |◇          |‖=======|    ___||   _|  -__||   _|  _  |  _  |  _  |   _|  _  ||  -__|   _|=======
 *  \__@__@__@__/‖=======|___|    |__| |_____||____|_____|_____|___._|__| |_____||_____|__|=========
 *     ⊥  ⊥  ⊥
 *
 * A web app to visualize scales, chords and arpeggios on all kinds of fretboards.
 *
 * Copyright (c) 2019-2022 (time of fork), cheap glitch
 * This software is distributed under the Mozilla Public License 2.0
 */

import Vue           from 'vue'
import VClickOutside from 'v-click-outside'
import VCSSModifiers from 'vue-css-modifiers'

import * as domtoimage from 'dom-to-image';
import { saveAs }              from 'file-saver'


import App           from '@/App'
import store         from '@/stores/main'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {library} from '@fortawesome/fontawesome-svg-core';
import {
	faGuitar,faEye,faCircleXmark, faCopy, faFileArrowDown, faArrowLeft,
	faList, faGear, faGauge, faChevronDown, faChevronUp, faEyeSlash, faEllipsis, 
	faMusic, faArrowCircleUp, faMoon, faHandPaper, faArrowsV, faListOl,
	faInfoCircle, faCamera, faFileImage, faPlus, faTrashAlt, faBullseye, faCross, faArrowsUpDown, faHand, faTrashCan, faPaintRoller,
} from '@fortawesome/free-solid-svg-icons';
import {faGithub} from '@fortawesome/free-brands-svg-icons'
library.add(
	faGuitar, faEye, faEyeSlash, faGithub, faCircleXmark, faCopy, faFileArrowDown,
	faArrowLeft, faList, faGear, faGauge, faChevronDown, faChevronUp, faEllipsis,
	faMusic, faArrowCircleUp, faMoon, faHandPaper, faArrowsV, faListOl,
	faInfoCircle, faCamera, faFileImage, faPlus, faTrashAlt, faBullseye,
	faCross, faArrowsUpDown, faHand, faTrashCan, faPaintRoller
);

window.saveAs = saveAs;

/**
 * Set global config options
 */
Vue.config.productionTip = false;
Vue.config.performance   = process.env.NODE_ENV === 'development';

/**
 * Register plugins, directives & external components
 */
Vue.directive('mods',          VCSSModifiers);
Vue.directive('click-outside', VClickOutside.directive);

/**
 * Register globally the base components
 */
const baseComponents = require.context('@/components', false, /V[A-Z]\w+\.vue$/);
baseComponents.keys().forEach(function(filename) {
	const name   = filename.split('/').pop().replace(/\.\w+$/, '');
	const config = baseComponents(filename);

	Vue.component(name, config.default || config);
});

Vue.component('font-awesome-icon', FontAwesomeIcon);

/**
 * Create the Vue instance
 */
new Vue({ store, render: h => h(App) }).$mount('#app');

window.domtoimage = domtoimage;