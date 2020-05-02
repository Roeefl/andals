<template>
  <div class="game-dice">
    <BaseButton
      v-for="(diceValue, d) in dice"
      :key="`dice-${d}`"
      color="primary"
      :width="small ? '28px' : '56px'"
      :height="small ? '28px' : '56px'"
      :iconName="d < 2 ? `dice-${diceValue}` : `numeric-${diceValue}-box-outline`"
      :iconSize="small ? '24px' : '36px'"
      :iconColor="diceColors[`dice${d}`]"
      :clickable="enabled"
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
      small: {
        type: Boolean,
        default: false
      },
      enabled: {
        type: Boolean,
        default: false
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
