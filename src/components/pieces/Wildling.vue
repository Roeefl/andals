<script>
  import GameAsset from '@/components/game/GameAsset';
  import { wildlingColors } from '@/specs/wildlings';

  export default {
    name: 'Wildling',
    components: {
      GameAsset
    },
    props: {
      type: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: '40'
      }
    },
    created() {
      this.wildlingColors = wildlingColors;
    }
  }
</script>

<template>
  <span @click="$emit('clicked')" class="wildling">
    <GameAsset
      type="wildlings"
      :asset="type"
      :width="`${size}px`"
      :height="`${size}px`"
      :color="wildlingColors[type]"
    />
  </span>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wildling {
    // padding: 1px;
    // border-radius: 100%;
    // border: 1px solid black;
  }
</style>
