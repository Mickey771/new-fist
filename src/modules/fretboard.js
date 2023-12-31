import { notes, models }          from '@/modules/music'
import { NB_FRETS, MAX_NB_FRETS } from '@/modules/constants'
import { intervalsForSequence } from '@/modules/intervals';
import { shiftSequencesDown } from '@/modules/shift12';

/**
 * Generate a list of frets with infos on the sequences they belong to
 */
export function getFrets(sequences, tuningNotes, capo, flipped) {
	// The incoming tuning notes may be flipped for display purposes.
	// If they are, then we find the tuning note of the lowest string
	// by looking at the last element of the `tuningNotes` array.
	// Otherwise, if the tuning notes are not flipped, then the tuning
	// note of the lowest string should appear as the first element.
	const lowestTuningNote = flipped ?
		tuningNotes[tuningNotes.length-1] : tuningNotes[0];
	// Get the index of the fret of the root note on the lowest string for every sequence
	const positionOffsets = sequences.map(
		seq => getInterval(lowestTuningNote, seq.tonality)
	);

	// Sort the sequences to process the non-intersected ones first
	const sortedSequences = [...sequences].sort(function(a, b) {
		if (a.isIntersected && !b.isIntersected) return  1;
		if (b.isIntersected && !a.isIntersected) return -1;

		return 0;
	});

	// Build an array of frets for each string and flatten them in a single list
	let allFrets = tuningNotes.flatMap(function(openStringNote, stringNumber) {
		// Create the frets
		const frets = [...Array(NB_FRETS).keys()].map(fretNumber => ({
			string:        stringNumber,
			number:        fretNumber,
			note:          notes[(notes.indexOf(openStringNote) /*+ capo*/ + fretNumber) % notes.length],
			sequences:     [],
			isHighlighted: false,
		}));

		// Mark the frets that belong to each sequence
		sortedSequences.forEach(function(seq, index) {
			// Find the first fret whose note is the root of the sequence
			const rootFret = frets.findIndex(fret => fret.note == seq.tonality);

			// Create a function to add a reference to the sequence into the frets corresponding to the given interval
			function applyInterval(interval) {
				const fretNumber = rootFret + interval;

				// If the sequence is intersected, check that there is already at least one other sequence on the fret
				if (seq.isIntersected && frets[fretNumber].sequences.length == 0) return;

				// Modify the current fret and the one 12 half-steps above/below it
				[fretNumber, (fretNumber + 12) % NB_FRETS].forEach(function(fret) {
					// If we are displaying a single position, 
					// and this fret is **not** in that position,
					// then skip this fret.
					if (!shouldDisplayFret(fret,index,seq,positionOffsets)) return;

					frets[fret].sequences.push({ index, interval });

					if (interval === seq.highlightedInterval)
						frets[fret].isHighlighted = true;
				});
			}

			// Loop through the intervals (plus the root) and apply them to their corresponding frets
			applyInterval(0);
			intervalsForSequence(seq).forEach(interval => applyInterval(interval));
		});

		// Extend the fretboard by duplicating the frets needed to reach the upper limit
		return frets.concat(frets.slice(0, MAX_NB_FRETS - NB_FRETS).map(fret => ({ ...fret, number: fret.number + NB_FRETS })));
	});

	allFrets = shiftSequencesDown(allFrets);

	allFrets = filterCapo(allFrets,capo);

	return allFrets;
}

function filterCapo(frets,capo) {
	return frets.map( fret => ({
		...fret,
		sequences: fret.number < capo ? [] : fret.sequences
	}));
}

/** Should a fret be displayed for the sequence `seq`?  */
function shouldDisplayFret(fret,index,seq, positionOffsets) {
	// If using custom tuning, compare fret number to bounds.
	if (seq.position === -1) {
		const shouldDisplay = (
			fret >= seq.customFretBounds[0] 
			&& fret <= seq.customFretBounds[1]
		);
		return shouldDisplay;
	}
	// If using whole scale, fret must be valid.
	if (seq.position === 0) return true;
	// If model has no positions, fret must be valid.
	if (!('positions' in models[seq.model])) return true;

	return isInPosition(fret,models[seq.model].positions[seq.position - 1], positionOffsets[index]);
}

/**
 * Check that a fret is in the boundaries of a position
 */
function isInPosition(fretNumber, position, offset) {
	const start     = position[0] + offset;
	const stop      = position[1] + offset;

	return start < stop
		? (start <= fretNumber && fretNumber <= stop)
		: (start <= fretNumber || fretNumber <= stop)
}

/**
 * Return the positive number of half-steps between two notes.
 * This is the minimum number of half-steps that will take you 
 * from `note1` **upwards** to `note2`.
 */
export function getInterval(note1, note2) {
	const index1 = notes.indexOf(note1);
	const index2 = notes.indexOf(note2);

	return index1 <= index2 ? index2 - index1 : notes.length - (index1 - index2);
}