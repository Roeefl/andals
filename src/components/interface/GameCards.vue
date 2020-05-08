<template>
  <div class="game-cards">
    <div v-if="!!deck" key="game-cards-deck" class="deck">
      <GameCard
        v-for="(card, index) in deck"
        :key="`${card.type}-${index}`"
        :visible="visible"
        :type="card.type"
        :full="full"
        :clickable="!card.wasPlayed"
        :wasPlayed="card.wasPlayed"
        @clicked="$emit('game-card-clicked', { cardType: card.type, index })"
        class="game-card"
      />
    </div>
    <GameCard v-else key="game-cards-single" :full="full" type="knight" :count="count" @clicked="$emit('purchase-game-card')" />
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
      visible: {
        type: Boolean,
        default: false 
      },
      full: {
        type: Boolean,
        default: false
      },
      deck: {
        type: Array,
        default: null
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $game-card-size: 80px;

  .game-cards {
    display: flex;
  
    .deck {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      
      .game-card {
        // height: 100%;
        flex: 1;
        width: $game-card-size;
        height: $game-card-size;
      }
    }
  }
</style>
