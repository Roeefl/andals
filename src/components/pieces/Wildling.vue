<template>
  <span @click="$emit('remove')">
    <GameAsset
      type="wildlings"
      :asset="type"
      :width="`${size}px`"
      :height="`${size}px`"
      :color="wildlingColors[type]"
    />
  </span>
</template>

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
