<template>
  <div class="game-dice">
    <BaseButton
      v-for="(diceValue, d) in dice"
      :key="`dice-${d}`"
      :color="diceColors[`dice${d}`]"
      :iconName="d <= 1 ? `dice-${diceValue}` : undefined"
      iconColor="black"
      :clickable="enabled"
      @click="$emit('clicked')"
      :iconSize="small ? '24px' : '36px'"
      :width="small ? '28px' : '56px'"
      :height="small ? '28px' : '56px'"
      class="cube"
    >
      <span v-if="d >= 2">
        {{ diceValue }}
      </span>
    </BaseButton>
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
    
    .cube {
      min-width: 0;
      margin-right: $spacer / 3;
      color: white;
      font-size: $font-size-md;
    }
  }
</style>
