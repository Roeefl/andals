<template>
  <div class="wrapper">
    <div v-if="!!deck" class="deck">
      <GameCard
        v-for="(card, index) in deck"
        :key="`${card.type}-${index}`"
        :visible="visible"
        :type="card.type"
        :clickable="!card.wasPlayed"
        :wasPlayed="card.wasPlayed"
        @clicked="$emit('play-game-card', { cardType: card.type, index })"
      />
    </div>
    <GameCard v-else type="knight" :count="count" :clickable="allowed" @clicked="$emit('purchase-card')" />
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
      visible: {
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
    }
  }
</style>
