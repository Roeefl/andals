<template>
  <div class="game-dice">
    <BaseButton
      v-for="(diceValue, d) in dice"
      :key="`dice-${d}`"
      color="secondary"
      :width="size"
      :height="size"
      :iconName="d < 2 ? `dice-${diceValue}` : `numeric-${diceValue}-box-outline`"
      :iconSize="size"
      :iconColor="diceColors[`dice${d}`]"
      @click="$emit('clicked')"
      class="dice"
    />
  </div>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';
  import { diceColors } from '@/specs/dice';

  export default {
    name: 'GameDice',
    components: {
      BaseButton
    },
    props: {
      dice: {
        type: Array,
        default: () => [3, 4]
      },
      size: {
        type: String,
        default: '64px'
      }
    },
    created() {
      this.diceColors = diceColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .game-dice {
    display: flex;
    
    .dice {
      min-width: 0;
      margin-right: $spacer / 3;
      color: white;
      font-size: $font-size-lg;
    }
  }
</style>
