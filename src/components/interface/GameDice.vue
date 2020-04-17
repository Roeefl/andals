<template>
  <v-dialog
    :value="true"
    hide-overlay
    persistent
    width="300"
  >
    <div class="dice">
      <div v-for="(diceValue, i) in dice" :key="`dice-${i}-${diceValue}`" class="cube" :class="`cube-${i}`">
        <BaseIcon size="80px" color="black" :name="`dice-${diceValue}`" />
      </div>
    </div>
  </v-dialog>
</template>

<script>
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'GameDice',
    components: {
      BaseIcon
    },
    data: () => ({
      dice: [4, 3]
    }),
    mounted() {
      const diceRoller = setInterval(() => {
        const randomDice1 = Math.floor(Math.random() * 6) + 1;
        const randomDice2 = Math.floor(Math.random() * 6) + 1;
        this.dice = [randomDice1, randomDice2];
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