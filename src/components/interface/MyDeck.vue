<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="800"
  >
    <ActionCard
      :title="myPlayer.mustDiscardHalfDeck ? `Discard ${discardCardsNeeded} Cards` : 'My Deck'"
      :cancel="!myPlayer.mustDiscardHalfDeck"
      @cancel="$emit('close')"
      :approve="!myPlayer.mustDiscardHalfDeck || selectedCards.length === discardCardsNeeded"
      @approve="$emit('approve', selectedCards)"
    >
      <div class="wrapper">
        <GamePieces type="road" :pieces="myPlayer.roads" :color="myPlayer.color" class="pieces" />
        <GamePieces type="settlement" :pieces="myPlayer.settlements" :color="myPlayer.color" class="pieces" />
        <GamePieces type="cities" :pieces="myPlayer.cities" :color="myPlayer.color" class="pieces" />
        <BaseDeck :deck="myPlayer.resourceCounts" @card-clicked="toggleCardSelection($event)" :selectedCards="selectedCards" />
        <GameCards
          v-if="myPlayer.gameCards && myPlayer.gameCards.length > 0"
          :deck="myPlayer.gameCards"
          class="game-cards"
        />
      </div>
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import BaseDeck from '@/components/game/BaseDeck';
  import GameCards from '@/components/interface/GameCards';
  import GamePieces from '@/components/interface/GamePieces';

  export default {
    name: 'MyDeck',
    components: {
      ActionCard,
      BaseDeck,
      GameCards,
      GamePieces
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      myPlayer: {
        type: Object,
        default: () => {}
      }
    },
    data: () => ({
      selectedCards: []
    }),
    computed: {
      discardCardsNeeded: function() {
        const totalCards = Object
          .values(this.myPlayer.resourceCounts)
          .reduce((r1, r2) => r1 + r2, 0);

        return Math.floor(totalCards / 2);
      }
    },
    methods: {
      toggleCardSelection: function(card) {
        if (!this.myPlayer.mustDiscardHalfDeck) return;
        
        const { index, resource } = card;

        const isCardSelected = this.selectedCards.some(sel => sel.index === index && sel.resource === resource);

        this.selectedCards = isCardSelected
          ? this.selectedCards.filter(sel => sel.index !== index || sel.resource !== resource)
          : [
            ...this.selectedCards,
            card
          ];
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wrapper {
    display: flex;
    flex-direction: column;
  }

  .pieces {
    padding: $spacer / 2;
    margin: $spacer / 2;
    
    & + & {
      border-top: 1px solid lightgray;
    }
  }

  .game-cards {
    padding: $spacer / 2;
    margin: $spacer / 2;
    border-top: 1px solid lightgray;
  }
</style>
