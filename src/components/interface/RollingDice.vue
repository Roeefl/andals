<template>
  <BaseOverlay :isOpen="true">
    <div class="dice-container">
      <BaseButton
        v-for="(diceValue, d) in dice"
        :key="`dice-${d}-${diceValue}`"
        color="transparent"
        :iconName="d < 2 ? `dice-${diceValue}` : `numeric-${diceValue}-box-outline`"
        iconSize="120px"
        :iconColor="diceColors[`dice${d}`]"
        width="120px"
        height="120px"
        class="dice"
      />
    </div>
  </BaseOverlay>
</template>

<script>
  import BaseOverlay from '@/components/common/BaseOverlay';
  import BaseButton from '@/components/common/BaseButton';
  import { ROOM_TYPE_BASE_GAME, ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';
  import { diceColors } from '@/specs/dice';

  export default {
    name: 'RollingDice',
    components: {
      BaseOverlay,
      BaseButton
    },
    props: {
      type: {
        type: String,
        default: ROOM_TYPE_BASE_GAME
      }
    },
    data: () => ({
      dice: [4, 3]
    }),
    created() {
      this.diceColors = diceColors;
    },
    mounted() {
      const diceRoller = setInterval(() => {
        const randomDice1 = Math.floor(Math.random() * 6) + 1;
        const randomDice2 = Math.floor(Math.random() * 6) + 1;
        this.dice = [randomDice1, randomDice2];

        if (this.type === ROOM_TYPE_FIRST_MEN) {
          const wildlingDice = Math.floor(Math.random() * 12) + 1;
          
          this.dice = [
            ...this.dice,
            wildlingDice
          ];
        }
      }, 50);

      setTimeout(() => {
        clearInterval(diceRoller);
        this.$emit('finished', this.dice);
      }, 2000);
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $dice-size: 160px;

  .dice-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: $secondary;
  }

  .dice {
    & + & {
      margin-left: $spacer;
    }
  }
</style>