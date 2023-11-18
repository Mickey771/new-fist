<!--{{{ Pug -->
<template lang="pug">

.PositionBracket(:style="style")
    .label.hand-drawn(v-if="!flipY") {{ text }}
    svg(
        :width="width"
        :height="height"
    )
        path(
            :d="path"
            stroke="black" 
            stroke-width="2"
            fill="transparent"
            :transform="transform"
        )
    .label.hand-drawn(v-if="flipY") {{ text }}

</template>
<!--}}}-->


<!--{{{ JavaScript -->
<script>

import { get }                  from 'vuex-pathify'

import { findBackground, pixelPosToCssPos } from '@/modules/background'
import { 
	formatPositionNumber
}                                     from '@/modules/intervals'
import { instruments } from '@/modules/music'

import FretboardViewerFret      from '@/components/FretboardViewerFret'

export default {
    name: 'PositionBracket',

    data() {
        return { height: 50 };
    },

    components: {
        FretboardViewerFret,
    },

    props: {
        fretNumber: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            default: 'orange'
        },
        flipY: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        text() {
            return formatPositionNumber(this.fretNumber, 'Position');
        },
        // Bounds of the bracket part in top-left pixel coordinates.
        bounds() {
            // Whether we base the bracket position
            // around the top or bottom string
            // depends on whether we are flipping this bracket.
            const nbStrings = instruments[this.instrument].nbStrings;
            const string = this.flipY ? nbStrings - 1 : 0;

            function toPos(vec) {
                return {left: vec[0], top: vec[1]}
            }

            // TODO move this logic to background.js
            const background = findBackground(this.instrument);
            const fretPositions = background.strings[string];
            const leftPos = pixelPosToCssPos(toPos(fretPositions[this.fretNumber-1]), background, this.backgroundSize);

            // const leftPos = positionForFret(
            //     {
            //         number:this.fretNumber,
            //         string: string
            //     },
            //     this.instrument,
            //     this.backgroundSize
            // );
            
            // Assume positions span 5 frets.
            const rightPos = pixelPosToCssPos(
                toPos(fretPositions[Math.min(this.fretNumber+4, fretPositions.length-1)])   ,
                background,
                this.backgroundSize
            );

            //console.log({leftPos, rightPos});

            const bounds = {
                left: parseInt(leftPos.left,10),
                right: parseInt(rightPos.left,10),
            };

            if (this.flipY) {
                bounds.top = parseInt(leftPos.top,10) + 100;
                bounds.bottom = bounds.top + this.height;
            } else {
                bounds.bottom = parseInt(leftPos.top,10) - 20,
                bounds.top = bounds.bottom - this.height;
            }
                
            return bounds;
        },
        width() {
            const bounds = this.bounds; // Invoke computed property.
            return bounds.right - bounds.left;
        },
        path() {
            const w = this.width;
            const h = this.height;
            // Corner radius.
            const r = h/2;

            // Make this more readable!!!
            const startAtBottomLeft = `M 0 ${h}`
            const curveUpRight = `Q 0 ${r} ${r} ${r}`;
            const goStraight = `h ${w/2-2*r}`;
            const curveRightUp = `q ${r} 0 ${r} ${-r}`;
            const curveDownRight = `q 0 ${r} ${r} ${r}`;
            const curveRightDown = `q ${r} 0 ${r} ${r}`;

            return [
                startAtBottomLeft,
                curveUpRight,
                goStraight,
                curveRightUp,

                curveDownRight,
                goStraight,
                curveRightDown
            ].join(' ');
        },
        transform() {
            const h = this.height;
            if (this.flipY) {
                return `translate(0,${h}) scale(1,-1)`;
            }
            else return "";
        },
        style() {
            const bounds = this.bounds;

            return {
                bottom: `calc(100% - ${bounds.bottom}px)`,
                left: `${bounds.left}px`,
                right: `calc(100% - ${bounds.right}px)`,
                color: this.color
            }
        },
        ...get('fretboard', [
            'instrument'
        ]),
        ...get(['backgroundSize'])
    },

    methods: {
        
    }
}

</script>
<!--}}}-->

<!--{{{ SCSS -->
<style lang="scss" scoped>

.PositionBracket {
    position: absolute;
    z-index: 2;
    border-width: 2px;
    border-color: #444;
}

.PositionBracket    .label {
    font-size: 3rem;
    @include outline-text(1px);
    text-align: center;
}
</style>
<!--}}}-->
