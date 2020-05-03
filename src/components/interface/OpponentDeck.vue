<template>
  <v-dialog
    width="800"
    :value="isOpen"
    @click:outside="onCancel"
  >
    <ActionCard
      :title="`${opponent.nickname}'s Deck`"
      :approve="!!selectedCard.resource && (!giveBack || !!selectedGiveCard.resource)"
      @approve="onConfirm"
      @cancel="onCancel"
    >
      <div class="opponent-deck-container">
        <div class="opponent-deck">
          <h3>
            {{ `Pick one card from ${opponent.nickname}'s Deck` }}
          </h3>
          <BaseDeck
            v-if="opponent.resourceCounts"
            :hideResources="hideResources"
            :deck="opponent.resourceCounts"
            @card-clicked="toggleSelectedCard($event)"
            :selectedCards="[selectedCard]"
          />
        </div>
        <div class="my-deck">
          <h3 v-if="giveBack">
            Give one resource card in exchange:
          </h3>
          <BaseDeck
            v-if="giveBack"
            :deck="myDeck"
            @card-clicked="selectedGiveCard = $event"
            :selectedCards="[selectedGiveCard]"
          />
        </div>
      </div>
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
      },
      onDestroy: function() {
        this.selectedCard = {};
        this.selectedGiveCard = {};
      },
      onCancel: function() {
        this.$emit('cancel');
        this.onDestroy();
      },
      onConfirm: function() {
        this.$emit('steal', { selectedCard: this.selectedCard, selectedGiveCard: this.selectedGiveCard });
        this.onDestroy();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .opponent-deck-container {
    margin: $spacer / 2;
    padding: $spacer / 2;

    .opponent-deck {
      margin-bottom: $spacer;
    }

    .my-deck {
      border-top: 1px solid black;
      margin-top: $spacer;
      padding-top: $spacer;
    }
  }
</style>
