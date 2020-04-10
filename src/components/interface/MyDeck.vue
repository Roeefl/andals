<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="800"
  >
    <ActionCard
      :title="discardMode ? `Discard ${discardCardsNeeded} Cards` : 'My Deck'"
      :cancel="!discardMode"
      @cancel="$emit('close')"
      :approve="!discardMode || selectedCards.length === discardCardsNeeded"
      @approve="$emit('approve', selectedCards)"
    >
      <div class="wrapper">
        <BaseDeck :deck="deck" @card-clicked="toggleCardSelection($event)" :selectedCards="selectedCards" />
        <GameCards
          allowed
          :deck="gameCards"
        />
      </div>
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import BaseDeck from '@/components/game/BaseDeck';
  import GameCards from '@/components/interface/GameCards';

  export default {
    name: 'MyDeck',
    components: {
      ActionCard,
      BaseDeck,
      GameCards
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      discardMode: {
        type: Boolean,
        default: false
      },
      deck: {
        type: Object,
        default: () => {}
      },
      gameCards: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
      selectedCards: []
    }),
    computed: {
      discardCardsNeeded: function() {
        const totalCards = Object
          .values(this.deck)
          .reduce((r1, r2) => r1 + r2, 0);

        return Math.floor(totalCards / 2);
      }
    },
    methods: {
      toggleCardSelection: function(card) {
        if (!this.discardMode) return;
        
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
</style>
