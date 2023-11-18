/** Shift sequences down such that 
 *  if we receive a sequence beginning somewhere above the 12th fret,
 *  we move it down 12 frets. */
export function shiftSequencesDown(frets) {
	const fretsBySequence = findFretsBySequenceAndString(frets);

	const shiftedFrets =  frets.map(
		fret => ({
            ...fret, 
            sequences: shiftFretSequences(fretsBySequence,fret)
        })
	);

    return shiftedFrets;
}

/** Compute a map of (sequence index, string => [fret numbers]).
 *  Key is index-string. For example map.get('2-4') would contain
 *  all of the frets on the 4th string in the 3rd sequence.
 */
function findFretsBySequenceAndString(frets) {
    const fretsBySequence = new Map();
    for (const fret of frets) {
        for (const sequence of fret.sequences) {
            const key = `${sequence.index}-${fret.string}`;
            const sequenceFrets = fretsBySequence.get(key) ?? [];
            sequenceFrets.push({
                number: fret.number,
                interval: sequence.interval
            });
            fretsBySequence.set(key, sequenceFrets);
        }
    }
    return fretsBySequence;
}

/** Shift fret sequences (for a particular fret) downwards,
 *  if applicable.
 */
function shiftFretSequences(fretsBySequence, fret) {
    if (fret.number < 12) {
        const fretSequences = fret.sequences.slice();
        // If this fret is below 12, then it may be eligible
        // to recieve a shifted sequence.
        // Index is sequence index.
        for (const key of fretsBySequence.keys()) {
            const [index,string] = key.split('-');
            if (Number(string) !== fret.string) continue;

            const sequenceFrets = fretsBySequence.get(key) ?? [];
            if (
                sequenceFrets.every(
                    sequenceFret => sequenceFret.number >= 12
                )
            ) {
                const fretNumberAndInterval = sequenceFrets.find(
                    ({number}) => number === fret.number + 12
                );
                
                if (fretNumberAndInterval !== undefined) {
                    fretSequences.push({
                        index,
                        interval: fretNumberAndInterval.interval
                    });
                }   
            }
        }
        return fretSequences;
    }
    else {
        // If this fret is at 12 or above, then we may need
        // to remove a sequence.
        return fret.sequences.filter(
            // Keep the sequence if it contains at least one
            // fret below 12.
            sequence => 
                (fretsBySequence.get(`${sequence.index}-${fret.string}`)??[])
                .some(
                    ({number}) => number < 12
                )
        );
    }
}