<!--{{{ Pug -->
<template lang="pug">

div.CustomScaleNotes(v-if="shouldDisplay")
    div.customScaleNotesHeader Custom Scale Notes
    div.scale-notes
        div(
            v-for="[note,active] of notes"
        )
            div.scale-note-label {{ noteName(note) }}
            input(
                type="checkbox"
                :checked="isNoteActive(note)"
                @change="v=>updateNoteActive(note,v)"
            )

</template>
<!--}}}-->
        
<!--{{{ JavaScript -->
<script>
        
import { get }                  from 'vuex-pathify'

import { notesNames }           from '@/modules/music'

export default {
    name: 'CustomScaleNotes',

    props: {
        index: {
            type: Number,
            required: true
        }
    },

    components: {},

    computed: {
        notes() {
            return Object.entries(this.sequence.customSequence);
        },
        shouldDisplay() {
            return this.sequence.model === 'custom';
        },
        sequence() {
            return this.sequences[this.index];
        },
        ...get('sequences', ['sequences'])
    },

    methods: {
        updateNoteActive(note,event) {
            const newCustomSequence = {
                ...this.sequence.customSequence,
                [note]: event.target.checked
            };
            this.$store.commit('sequences/update', {
                index: this.index,
                prop: 'customSequence',
                value: newCustomSequence
            });
        },
        noteName(note) {
            return notesNames[note];
        },
        isNoteActive(note) {
            return this.sequence.customSequence[note];
        }
    }
}

</script>
<!--}}}-->

<!--{{{ SCSS -->
<style lang="scss" scoped>

.CustomScaleNotes {
    color: var(--color--text);
}

.customScaleNotesHeader {
    font-size: 2rem;    
}

.scale-notes {
    display: flex;  
    flex-direction: row;
    @include space-children-h(8px);
}

.scale-note-label {
    font-size: 1.5rem;
    text-align: center;
}


</style>
<!--}}}-->