import { getFrets } from '@/modules/fretboard2'
import { NB_FRETS } from '@/modules/constants';

/** Get the fret numbers present in a sequence. */
function getFretNumbers(sequence, tuningNotes) {
    const frets = getFrets(
        [
            // Altered sequence,
            // forced into the 'open' position.
            {
                ...sequence,
                position: 0
            }   
        ],
        tuningNotes
    );
    const sequencedFrets = frets.filter(
        fret => fret.sequences.length > 0
    );
    return new Set(sequencedFrets.map(fret => fret.number));
}

function findFretNumber(fretNumbers,start,offset,stop) {
    for (let i=start; i !== stop; i += offset) {
        if (fretNumbers.has(i)) return i;
    }
    return undefined;
}

/** Increment a position with the nudger. */
export function incrementPosition(sequence, tuningNotes) {
    const position = sequence.position;
    if (position >= NB_FRETS) return position;

    const fretNumbers = getFretNumbers(sequence, tuningNotes);
    const found = findFretNumber(
        fretNumbers, 
        Math.max(1,position+1),
        1,
        NB_FRETS+1
    );
    return found ?? position;
}

/** Decrement a position with the nudger. */
export function decrementPosition(sequence, tuningNotes) {
    const position = sequence.position;
    if (position <= 1) return -2; // Custom

    const fretNumbers = getFretNumbers(sequence, tuningNotes);
    const found = findFretNumber(fretNumbers, position-1, -1, -1);
    return found ?? position;
}