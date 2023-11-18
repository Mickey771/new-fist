<!--{{{ Pug -->
<template lang="pug">

div.PositionNudgers(
    v-if="shouldDisplay"
)
    span.nudger(@click="handleClickLeft") {{ '<' }}
    span.nudger(@click="handleClickRight") {{ '>' }}
        
</template>
<!--}}}-->

<!--{{{ JavaScript -->
<script>

import { get }                  from 'vuex-pathify'

import { notesNames }           from '@/modules/music'

export default {
    name: 'PositionNudgers',

    components: {},

    computed: {
        tonalities() {
            return notesNames;
        },
        position() {
            const sequence = this.sequences[0];
            return sequence?.position;
        },
        shouldDisplay() {
            return this.position > 0 || this.position === -2;
        },
        ...get('sequences', ['sequences'])
    },

    methods: {
        handleClickLeft() {
            this.$store.commit('decrementPosition');
        },
        handleClickRight() {
            this.$store.commit('incrementPosition');
        }
    }
}

</script>
<!--}}}-->

<!--{{{ SCSS -->
<style lang="scss" scoped>

.PositionNudgers {
    color: var(--color--text);
    position: absolute;
    top: 550px;
    left: 0px;
    right: 0px;
    font-size: 36px;

    display: flex;
    justify-content: center;
}
.nudger {
    cursor: pointer;
    margin: 16px;
    background-color: var(--color--bg--accent);
    border-radius: 1000px;
    width: 2em;
    height: 2em;
    color: black;

    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
}

</style>
<!--}}}-->
