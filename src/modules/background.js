/** Code that applies to different background images,
 *  mostly regarding layout.
 */

import { instruments } from '@/modules/music'

import BASS_BACKGROUND from '@/modules/backgrounds/bass'
import BASS_5_BACKGROUND from '@/modules/backgrounds/bass5'
import BASS_6_BACKGROUND from '@/modules/backgrounds/bass6'

import BANJO_5_BACKGROUND from '@/modules/backgrounds/banjo5'

import CIGAR_BOX_4_BACKGROUND from '@/modules/backgrounds/cigar4'

import GUITAR_BACKGROUND from   '@/modules/backgrounds/guitar'
import GUITAR_7_BACKGROUND from '@/modules/backgrounds/guitar7'
import GUITAR_8_BACKGROUND from '@/modules/backgrounds/guitar8'
import GUITAR_9_BACKGROUND from '@/modules/backgrounds/guitar9'
import GUITAR_10_BACKGROUND from '@/modules/backgrounds/guitar10'

import MANDOLIN_BACKGROUND from '@/modules/backgrounds/mandolin'

import UKULELE_BACKGROUND from '@/modules/backgrounds/ukulele'

export const BACKGROUNDS = {
    'mandolin': MANDOLIN_BACKGROUND,

    'bass': BASS_BACKGROUND,
    'bass-5': BASS_5_BACKGROUND,
    'bass-6': BASS_6_BACKGROUND,

    'cigar-box-4': CIGAR_BOX_4_BACKGROUND,

    'guitar': GUITAR_BACKGROUND,
    'guitar-7': GUITAR_7_BACKGROUND,
    'guitar-8': GUITAR_8_BACKGROUND,
    'guitar-9': GUITAR_9_BACKGROUND,
    'guitar-10': GUITAR_10_BACKGROUND,

    'banjo-5': BANJO_5_BACKGROUND,

    'ukulele': UKULELE_BACKGROUND
};

/** Find a background configuration for an instrument name.
 *  Defaults to guitar if instrument name supplied is `undefined`.
 */
export function findBackground(instrument) {
    return BACKGROUNDS[instrument??'guitar'];
}

export function findBackgroundImage(instrument, isLandscape) {
    const background = findBackground(instrument);
    return isLandscape ? background.landscapeImage : background.portraitImage;
}

/** background is the layout JSON for the instrument.
 *  backgroundSize is the current dimensions of the loaded image.
 *  pixelpos is original pixel position in landscape coordinates
 *  relative to the full image.
 */
export function pixelPosToCssPos(pixelPos, background, backgroundSize) {
    const long = Math.max(backgroundSize.width,backgroundSize.height);
    const short = Math.min(backgroundSize.width,backgroundSize.height);
    // Assume landscape at this point. 
    // We'll fix up the portrait situation after.
    let cssPos = {
        left: `${Math.round(pixelPos.left * long / Math.max(background.size[0]))}px`,
        top: `${Math.round(pixelPos.top * short / Math.min(background.size[1]))}px`
    };

    // Flip coords if portrait.
    if (backgroundSize.height > backgroundSize.width) {
        cssPos = {
            // Note that this assumes we have no margins or padding.
            // I'd like to set `right` here, but the width used
            // is not set correctly at the moment.
            left: `calc(${backgroundSize.width}px - ${cssPos.top})`,
            top: cssPos.left
        }
    }
    return cssPos;
}

/** Background size parameter is size in DOM in CSS coords.
 *  Necessary to pass because it changes on portrait/landscape.
 */
export function positionForFret(fret, instrument, backgroundSize) {
    const background = findBackground(instrument);

    const pixelPos = interpolatePixelPosition(fret, instrument);

    return pixelPosToCssPos(pixelPos, background, backgroundSize);
}

export function positionForFretNumber(idx, instrument, backgroundSize) {
    const background = findBackground(instrument);

    const pixelPos = {
        left: background.fretNumbers[idx][0],
        top: background.fretNumbers[idx][1]
    };
    
    return pixelPosToCssPos(pixelPos, background, backgroundSize);
}

export function styleForCapo({backgroundSize,capo,instrument/*,isLayoutLandscape*/}) {

    const top = positionForFret(
        {string:0,number:capo}, instrument, backgroundSize
    );

    const lastString = instruments[instrument].nbStrings - 1;
    const bottom = positionForFret(
        {string:lastString, number:capo}, instrument, backgroundSize
    );

    //console.log({isLayoutLandscape})

    if (backgroundSize.width > backgroundSize.height) {
        return {
            left: top.left,
            top: `calc(${top.top} - 60px)`,
            height: `calc(${bottom.top} - ${top.top} + 60px + 80px)`,
            transform: '',
            width: 'auto'
        }
    }
    else {
        return {
            top: top.top,
            left: bottom.left,
            transform: `translate(50%,-50%) rotate(-90deg)`,
            height: `calc(${top.left} - ${bottom.left} + 85px)`,
            width: 'auto'
        }
    }
} 

/** Interpolate the pixel position at which to place a fret. */
function interpolatePixelPosition(fret, instrument) {
    const background = findBackground(instrument);

    const string = background.strings[fret.string];
    if (string === undefined || fret.number >= string.length) {
        return { top: -100, left: -100};
    }

    if (fret.number === 0) { // Special case for open strings.
        const nutPosition = string[0];
        const firstFretPosition = string[1];
        // Move the note slightly behind the nut.
        const notePos = {
            left: nutPosition[0] + (nutPosition[0]-firstFretPosition[0])/2,
            top: nutPosition[1] + (nutPosition[1]-firstFretPosition[1])/2,
        };
        return notePos;
    }

    return {
        left: mean(
            (string[fret.number]?.[0] ?? 0),
            (string[fret.number-1]?.[0] ?? 0)
        ),
        // Assume that Y does not change much, so do not bother interpolating.
        top:  string[fret.number]?.[1] ?? 0
    };
}

// /** Linear interpolation. */
// function lerp(start,end,alpha) {
//     return start + (end-start)*alpha
// }

/** Averaging. */
function mean(...nums) {
    let sum = 0;
    for (const num of nums) sum += num;
    return sum / nums.length;
}

// /**
//      * Compute the size of each fret so that:
//      *     - size(1) = 3/2
//      *     - size(n) = 1/2 (n = total number of frets)
//      *
//      * Which gives the following function:
//      *     f(x) = (3n - 1)/(2n - 2) - x/(n - 1)
//      */
// function computeFretLengths(numFrets) {
//     const n = numFrets;
    
//     const c = (3*n - 1)/(2*n - 2);

//     // Don't include the open string fret in the flexible layout
//     return [...Array(n-1).keys()].map(i => c - i/(n - 1));
// }

// /** Normalize an array of numbers such that they sum to 1. */
// function normalize(nums) {
//     let sum = 0;
//     for (const num of nums) sum += num;
    
//     return nums.map(num => num / sum);
// }