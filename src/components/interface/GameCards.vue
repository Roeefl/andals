<template>
  <div class="wrapper">
    <div v-if="!!deck" class="deck">
      <GameCard
        v-for="(card, i) in deck"
        :key="`${card.type}-${i}`"
        :type="card.type"
        clickable
      />
    </div>
    <GameCard v-else type="knight" @clicked="$emit('purchase-card')" :count="count" :clickable="allowed" />
  </div>
</template>

<script>
  import GameCard from '@/components/game/GameCard';

  export default {
    name: 'GameCards',
    components: {
      GameCard
    },
    props: {
      count: {
        type: Number,
        default: 0
      },
      allowed: {
        type: Boolean,
        default: false
      },
      deck: {
        type: Array,
        default: null
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wrapper {
    display: flex;
  
    .deck {
      display: flex;
      padding: $spacer / 2;
      margin: $spacer / 2;
      border-top: 1px solid lightgray;
    }
  }
</style>
