/** Convert enabled strings state to string. */

/**
 * Compute some text representing the currently enabled strings.
 * 
 * @param {*} enabledStrings is a boolean 1D mask.
 * @param {*} tuningNotes    is the currently tuned notes.
 *                           Includes excluded strings.
 * 
 * @returns a string
 */
export function enabledStringsText(enabledStrings, tuningNotes) {
    // If all strings are enabled, then omit the "Strings: ..." text.
    if (enabledStrings.every(x=>x)) return '';

    let enabledNotes = [];
    for (let i=0; i<enabledStrings.length; ++i) {
        if (enabledStrings[i]) enabledNotes.push(tuningNotes[i]);
    }

    return `strings: ${enabledNotes.join(',')}`;
}