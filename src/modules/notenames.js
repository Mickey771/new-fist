/** Resolve note names to correctly be sharp or flat. */

import { notesNames, notes } from '@/modules/music'
import { getInterval } from '@/modules/fretboard';
import { models } from '@/modules/music';

/** White keys on a keyboard. A through G. */
const whiteKeys = [...'ABCDEFG'];
/** Add an offset to a white key, with looping. */
function addOffsetToWhiteKey(whiteKey, offset) {
    const index = whiteKeys.indexOf(whiteKey);
    let newIndex = index+offset;
    if (newIndex<0) newIndex += whiteKeys.length;
    if (newIndex>=whiteKeys.length) newIndex -= whiteKeys.length;
    return whiteKeys[newIndex]
}

/** Does a given key use flats? */
function keyUsesFlats(tonality, mode) {
    // Given tonality, as a note index (where A=0).
    const tonalityIndex = notes.indexOf(tonality);
    // Tonality index of the associated major key.
    const majorTonalityIndex = ( tonalityIndex + 12 - mode) % 12;
    const majorTonality = notes[majorTonalityIndex];
    return [
        'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F',
        // Consider 'C' to be a flat scale to resolve
        // sequences such as "A blues minor" correctly.
        // This ensures that 'b5' is treated as a flat.
        'C'
    ].includes(majorTonality);
}

/** Coerce a note to its flat representation. */
function coerceToFlat(note) {
    const [whiteKey,accidental] = note;
    // If note is natural or already flat, leave it alone.
    if (accidental === undefined || accidental === 'b') return note;
    else { // Accidental must be sharp.
        // The flat of the next white key is equivalent.
        const nextWhiteKey = addOffsetToWhiteKey(whiteKey,1);
        return `${nextWhiteKey}b`;
    }
}

/** Coerce a note to its sharp representation. */
function coerceToSharp(note, tonality, model) {
    const [whiteKey,accidental] = note;

    if (model !== undefined) {
        const interval = getInterval(tonality, note);
        // If this is a tritone
        // and the model treats tritones as diminished fifths,
        // then this note should be displayed as a flat.
        if (interval === 6 && models[model].useFlatFifth) {
            return coerceToFlat(note);
        }
    }

    // If note is natural or already sharp, leave it alone.
    if (accidental === undefined || accidental === '#') return note;
    else { // Accidental must be flat.
        // The sharp of the previous white key is equivalent.
        const prevWhiteKey = addOffsetToWhiteKey(whiteKey,-1);
        return `${prevWhiteKey}#`;
    }
}

/** Stylize a note to use fancy sharp or flat. */
export function stylize(note) {
    return note.replace('#','♯').replace('b','♭');
}

/** Unstylize a note to use normal sharp or flat. */
function unstylize(note) {
    return note.replace('♯','#').replace('♭','b');
}

/** Resolve a note name based on the sequences it appears in.
 *  `model` here is the **name** of a model.
 */
export function resolveNoteName(note, tonality, mode, model) {
    if (note === undefined) return '?';

    // If no mode is supplied, assume we are talking about a major-style scale.
    mode = mode ?? 0;
    note = unstylize(note);
    tonality = unstylize(tonality);

    // If the note is being displayed in a context with no tonality
    // (e.g. no scale set, just looking at frets), then display
    // the note as-is.
    if (tonality === undefined) return notesNames[note];

    const accidental = resolveNoteAccidental(note, tonality, model, mode);
    if (accidental === '#') {
        return stylize(coerceToSharp(note, tonality, model));
    }
    else {
        return stylize(coerceToFlat(note));
    }
}

function resolveNoteAccidental(note, tonality, model, mode) {
    const interval = getInterval(tonality, note);

    // Edge cases for select intervals:

    // Interpret tritone as flat fifth for blues scales,
    // or augmented fourth for other scales.
    if (interval === 6) {
        return model.useFlatFifth ? 'b' : '#'
    }
    // Always interpret as b2
    if (interval === 1) {
        return 'b';
    }
    // Always interpret as #7
    if (interval === 11) { 
        return '#';
    }

    // The usual case. Resolves 3rds, 5ths, 6ths, b7s.
    return keyUsesFlats(tonality, mode) ? 'b' : '#';
}