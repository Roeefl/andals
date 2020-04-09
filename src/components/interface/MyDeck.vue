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
      <Deck :deck="deck" @card-clicked="toggleCardSelection($event)" :selectedCards="selectedCards" />
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import Deck from '@/components/game/Deck';

  export default {
    name: 'MyDeck',
    components: {
      ActionCard,
      Deck
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
        default: function() {
          return {};
        }
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
