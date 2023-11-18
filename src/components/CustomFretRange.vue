<!--{{{ Pug -->
<template lang="pug">

div.CustomFretRange(v-if="shouldDisplay")
    div.customScaleNotesHeader Custom Fret Range
    div.fretBounds
        div 
            div From
            VSelect(
                :options="fretOptions"
                :value="lowerBound"
                @change="updateLowerBound"
            )
        div
            div To
            VSelect(
                :options="fretOptions"
                :value="upperBound"
                @change="updateUpperBound"
            )

</template>
<!--}}}-->
        
<!--{{{ JavaScript -->
<script>
        
import { get }                  from 'vuex-pathify'

export default {
    name: 'CustomFretRange',

    props: {
        index: {
            type: Number,
            required: true
        }
    },

    components: {},

    computed: {
        shouldDisplay() {
            // Position value of -1 indicates that a custom sequence is selected.
            return this.sequence.position === -1;
        },
        sequence() {
            return this.sequences[this.index];
        },

        fretOptions() {
            return Object.fromEntries([...Array(24+1)].map(
                (_,idx) => [idx,idx]
            ));
        },

        /** Currently set custom fret bounds. */
        bounds() {
            return this.sequence.customFretBounds;
        },
        lowerBound() { return this.bounds[0]; },
        upperBound() { return this.bounds[1]; },

        ...get('sequences', ['sequences'])
    },

    methods: {
        updateBound(idx, value) {
            const newFretBounds = this.bounds.slice();
            // Bounds are always numeric.
            newFretBounds[idx] = Number(value);

            this.$store.commit('sequences/update', {
                index: this.index, // Sequence index
                prop: 'customFretBounds',
                value: newFretBounds
            });
        },
        updateLowerBound(value) {
            this.updateBound(0,value);
        },
        updateUpperBound(value) {
            this.updateBound(1,value);
        }
    }
}

</script>
<!--}}}-->
        
<!--{{{ SCSS -->
<style lang="scss" scoped>

.CustomFretRange {
    font-size: 2rem;
    color: var(--color--text);
}

.fretBounds {
    display: flex;
    @include space-children-h(32px);
    text-align: center;
}


</style>
<!--}}}-->