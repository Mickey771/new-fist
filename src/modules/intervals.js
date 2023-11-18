import { models, notes } from '@/modules/music';
import { getInterval }   from '@/modules/fretboard';

/** Given a sequence from our Vuex store, find the intervals.
 *  Non-trivial due to custom sequences.
 */
export function intervalsForSequence(sequence) {
    if (sequence.model === 'custom') {
        return convertNoteNamesToIntervals(sequence.customSequence, sequence.tonality);
    }
    else {
        return models[sequence.model].intervals;
    }
}

/** Convert note names to their intervals.
 *  Useful because sequences (scales/arpeggios) are
 *  internally represented as a list of intervals.
 */
function convertNoteNamesToIntervals(customSequence, tonality) {
    // During intial load, customSequence seems to be
    // briefly undefined. Not sure why.
    if (customSequence === undefined) return [];

    // Tonality, as a number.
    const numericTonality = notes.indexOf(tonality);

    const intervals = [];
    for (const [note,active] of Object.entries(customSequence)) {
        // Only consider active notes.
        if (active) {
            const noteIdx = notes.indexOf(note);
            // Transform notes into indices relative to 'A'.
            // TODO look at actual key here.
            intervals.push((noteIdx + 12 - numericTonality) % 12);
        }
    }
    return intervals;
}

export function formatPositionNumber(number, suffix='pos.') {
	if (number == 0)
		return `Open ${suffix}`;

	if (11 <= number && number <= 13)
		return `${number}th ${suffix}`;

	switch (`${number}`.slice(-1)) {
		case '1': return `${number}st ${suffix}`;
		case '2': return `${number}nd ${suffix}`;
		case '3': return `${number}rd ${suffix}`;
		default:  return `${number}th ${suffix}`;
	}
}

/** Transform a root-relative position to a fretted position.
 *  A root-relative position is given in terms of semitones
 *  from the lowest root note of the scale you can find.
 * 
 *  For example, on a E-A-D-G-B-E guitar, a relative position
 *  of -1 with a tonality of C indicates that the lowest fret
 *  in the position is 1 below C on the low-E string. That is,
 *  the lowest fret is 8-1 = 7.
*/
export function rootPositionToFrettedPosition(tonality,position,tuningNotes) {
    // In this context, we only care about the lowest string.
    // On a standard-tuned guitar, this would be the low E string.
    const tuningNote = tuningNotes[0];
    const halfSteps = getInterval(tuningNote,tonality);
    // Negative positions don't make any sense.
    // Consider them to be open positions.
    const fret = Math.max(0,halfSteps+position[0]) % 12;
    return formatPositionNumber(fret);
}