<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="800"
  >
    <ActionCard
      :title="`${opponent.nickname}'s Deck`"
      :cancel="false"
      :approve="!!selectedCard"
      @approve="$emit('steal', selectedCard)"
    >
      <Deck v-if="opponent.resourceCounts" hideResources :deck="opponent.resourceCounts" @card-clicked="toggleCard($event)" :selectedCards="[selectedCard]" />
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import Deck from '@/components/game/Deck';

  export default {
    name: 'OpponentDeck',
    components: {
      ActionCard,
      Deck
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      opponent: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      selectedCard: {}
    }),
    methods: {
      toggleCard: function(card) {
        const { index, resource } = card;
        
        const isTheSameCard = this.selectedCard.index === index && this.selectedCard.resource === resource;
        this.selectedCard = isTheSameCard ? {} : card;
      }
    }
  }
</script>
