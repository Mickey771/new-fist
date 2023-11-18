/** NEW FILE NOT UNDER MPL2. All rights reserved to Bradley Fish. */

import { tunings } from '@/modules/music';

/** Find the notes for the current tuning. Uses customTuning if
 *  selected tuning type is "Custom".
 */
export function tuningNotes({instrument,tuning,customTuning}) {
    if (tuning === 'custom') {
        // Use `Array.from()` to ensure copying.
        return Array.from(customTuning);
    }
    else {
        const instrumentTunings = tunings[instrument];
        return Array.from(instrumentTunings[tuning] ?? instrumentTunings['standard']);
    }
}