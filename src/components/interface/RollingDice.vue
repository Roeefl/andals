<template>
  <v-dialog
    :value="true"
    hide-overlay
    persistent
    width="500"
  >
    <div class="dice">
      <div v-for="(diceValue, d) in dice" :key="`dice-${d}-${diceValue}`" class="cube" :class="`cube-${d}`">
        <BaseIcon v-if="d <= 1" size="80px" color="secondary" :name="`dice-${diceValue}`" />
        <span v-if="d >= 2">
          {{ diceValue }}
        </span>
      </div>
    </div>
  </v-dialog>
</template>

<script>
  import BaseIcon from '@/components/common/BaseIcon';
  import { ROOM_TYPE_BASE_GAME, ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';

  export default {
    name: 'RollingDice',
    components: {
      BaseIcon
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

  .dice {
    display: flex;

    .cube {
      width: 50%;
      height: 150px;
      border: 1px solid black;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
    }
  }
</style>