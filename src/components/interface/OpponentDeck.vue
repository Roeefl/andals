<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="800"
  >
    <ActionCard
      :title="`${opponent.nickname}'s Deck`"
      :cancel="false"
      :approve="!!selectedCard.resource"
      @approve="$emit('steal', { selectedCard, selectedGiveCard })"
    >
      <BaseDeck
        v-if="opponent.resourceCounts"
        :hideResources="hideResources"
        :deck="opponent.resourceCounts"
        @card-clicked="toggleSelectedCard($event)"
        :selectedCards="[selectedCard]"
      />
      <BaseDeck
        v-if="giveBack"
        :deck="myDeck"
        @card-clicked="selectedGiveCard = $event"
        :selectedCards="[selectedGiveCard]"
      />
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import BaseDeck from '@/components/game/BaseDeck';

  export default {
    name: 'OpponentDeck',
    components: {
      ActionCard,
      BaseDeck
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      opponent: {
        type: Object,
        required: true
      },
      giveBack: {
        type: Boolean,
        default: false
      },
      myDeck: {
        type: Object,
        default: () => {}
      },
      hideResources: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      selectedCard: {},
      selectedGiveCard: {},
    }),
    methods: {
      toggleSelectedCard: function(card) {
        const { index, resource } = card;
        
        const isTheSameCard = this.selectedCard.index === index && this.selectedCard.resource === resource;
        this.selectedCard = isTheSameCard ? {} : card;
      }
    }
  }
</script>
