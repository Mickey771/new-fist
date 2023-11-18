/** Generate frets along the fretboard. */

import { NB_FRETS, }              from '@/modules/constants'
import { notes }                  from '@/modules/music'
import { getInterval }            from '@/modules/fretboard';
import { intervalsForSequence }   from '@/modules/intervals';

/** Sort the sequences to process the non-intersected ones first */
function sortSequences(sequences) {
	const sortedSequences = [...sequences].sort(function(a, b) {
		if (a.isIntersected && !b.isIntersected) return  1;
		if (b.isIntersected && !a.isIntersected) return -1;

		return 0;
	});
    return sortedSequences;
}

/** Get the frets along the fretboard, annotated with the sequences
 *  that they are in, by index and interval.
 * 
 *  @returns a 1d array of frets.
 */
export function getFrets(sequences,tuningNotes, capo) {
    // Capo defaults to '0' if undefined.
    capo = capo ?? 0;
    sequences = sortSequences(sequences);

    const frets = [];

    const notesByStringBySeq = [];
    
    for (let i=0; i<sequences.length; ++i) {
        const notesByString = tuningNotes.map( () => [] );
        notesByStringBySeq[i] = notesByString;
    }

    // Generate a fret for every string and fret number
    for (let stringIndex=0; stringIndex<tuningNotes.length; ++stringIndex) {
        for (let fretNumber=0; fretNumber<=NB_FRETS; ++fretNumber) {

            const openStringNote = tuningNotes[stringIndex];

            const noteIndex = (notes.indexOf(openStringNote) + fretNumber);
            const note = notes[ noteIndex % notes.length];

            const fret = {
                string: stringIndex,
                number: fretNumber,
                note: note,
                isHighlighted: sequences.some(
                    sequence => noteIsHighlighted(sequence,note)
                ),
                sequences: fretSequences(sequences, note, capo, fretNumber, notesByStringBySeq, stringIndex)
            };
            frets.push(fret);

            // Track which notes appeared on which strings, for each sequence.
            // We use this information to de-duplicate redundant notes.
            for (const fretSequence of fret.sequences) {
                notesByStringBySeq[fretSequence.index][stringIndex].push(note);
            }

        }
    }

    return frets;
}

/** Should the given note be highlighted? */
function noteIsHighlighted(sequence, note) {
    const interval = getInterval(sequence.tonality, note);
    return interval === sequence.highlightedInterval;
}

/** Does this note belong to the scale/arpeggio this sequence represents?
 *  Ignores positioning.
 */
function noteIsInScale(sequence, note) {
    const interval = getInterval(sequence.tonality, note);
    const intervals = intervalsForSequence(sequence).slice();
    // Custom sequences are the only kind that may omit the root.
    if (sequence.model !== 'custom') {
        intervals.unshift(0);
    }
    return intervals.includes(interval);
}

/** How many frets does a single position contain? */
const POSITION_LENGTH = 4;

/** Does the note belong to the position the sequence is set to? */
function noteIsInPosition(sequence, fretNumber) {
    // '0' represents the "whole scale" position.
    // All notes are present in this position.
    if (sequence.position === 0) {
        return true;
    }
    // '-1' represents the "custom" position.
    // We use the custom fret range bounds in this case.
    if (sequence.position === -1) {
        return (
            fretNumber >= sequence.customFretBounds[0] 
            && fretNumber <= sequence.customFretBounds[1]
        );
    }

    const position = sequence.position === -2 ? 0 : sequence.position;

    return (
        fretNumber >= position && 
        fretNumber <= position + POSITION_LENGTH
    );
}

/** Does the note belong to this (possibly positioned) sequence? */
function noteIsInSequence(sequence, note, fretNumber) {
    return (
        noteIsInScale(sequence, note) 
        && noteIsInPosition(sequence, fretNumber)
    );
}

/** Is this note, for this sequence, already covered on another string? */
function noteAlreadyCovered(sequence, note, notesByStringBySeq, sequenceIndex, stringIndex) {
    // Ignore when displaying full or custom fretboard.
    if (sequence.position === 0 || sequence.position === -1 ) return false;
    const notes = notesByStringBySeq[sequenceIndex][stringIndex-1];

    return notes && notes.length && notes.includes(note);
}

function fretSequences(sequences, note, capo, fretNumber, notesByStringBySeq, stringIndex) {
    const seqs = [];
    for (const [index,sequence] of sequences.entries()) {
        if (
            noteIsInSequence(sequence,note, fretNumber)
            && capo <= fretNumber
            && !noteAlreadyCovered(sequence, note, notesByStringBySeq, index, stringIndex)
        ) {
            const interval = getInterval(sequence.tonality, note);
            seqs.push({index, interval, sequence});
        }
    }

    // If every sequence is intersected, then this note should not appear.
    if (seqs.every(seq => seq.sequence.isIntersected)) {
        return [];
    }

    return seqs;
}