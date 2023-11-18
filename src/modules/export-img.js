/** Like export.js, but includes image and absolute positioning. */

import { saveAs }              from 'file-saver'
import { toJpeg, toPng, toSvg } from 'dom-to-image';

// domtoimage.toJpeg(document.getElementsByClassName('bg-and-frets')[0]).then(function(url) { saveAs(url, 'fretboard.jpg') })
// ^ one-liner version that can be pasted into console.

// Map of dom-to-image export functions, by suffix.
const exporters = {
    jpg: toJpeg,
    png: toPng,
    toSvg: toSvg
}

/**
 * Create and save an image of the fretboard
 */
export async function exportFretboard(format, ..._svgParams) {
    const nudgers = document.getElementsByClassName('nudger');
    for (const nudger of nudgers) nudger.style.display = 'none';

    const exporter = exporters[format];
    const dataUrl = await exporter(document.getElementsByClassName('bg-and-frets')[0]);
    saveAs(dataUrl, `fretboard.${format}`);

    for (const nudger of nudgers) nudger.style.display = '';
}

window.saveAs = saveAs;