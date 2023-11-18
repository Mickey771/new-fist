<!--{{{ Pug -->
<template lang="pug">

div.CustomTuning(
    v-if="shouldDisplay"
)
    h1.customTuningHeader Custom Tuning
    div.tuningStrings
        div
        VSelect.tuningString(
            v-for="(note,index) of this.customTuning"
            :options="tonalities"
            :value="note"
            @change="v=>updateTuningString(index,v)"
        )

</template>
<!--}}}-->

<!--{{{ JavaScript -->
<script>

import { get }                  from 'vuex-pathify'

import { notesNames }           from '@/modules/music'

export default {
    name: 'CustomTuning',

    components: {},

    computed: {
        tonalities() {
            return notesNames;
        },
        shouldDisplay() {
            return this.tuning === 'custom';
        },
        ...get('fretboard', ['customTuning', 'tuning'])
    },

    methods: {
        updateTuningString(index,tonality) {
            const newTuning = [...this.customTuning];
            newTuning[index] = tonality;
            this.$store.commit('fretboard/customTuning', newTuning);
        }
    }
}

</script>
<!--}}}-->

<!--{{{ SCSS -->
<style lang="scss" scoped>

.CustomTuning {
    color: var(--color--text);
}

.customTuningHeader {
    font-weight: initial;
    margin-bottom: 4px;
    text-align: center;
}

.tuningStrings {
    display: grid;
    font-size: 24px;
    grid-template-columns: 1fr repeat(6,auto) 1fr;
}
.tuningStrings.is-mobile-device {
    grid-template-columns: repeat(3,auto);
}

.tuningString {
    margin-right: 8px;
    margin-bottom: 8px;
} 

</style>
<!--}}}-->
