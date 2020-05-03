<template>
  <fragment>
    <BaseButton
      v-show="!displayDeck"
      spaced
      iconName="arrow-up-bold-box"
      iconSize="40px"
      iconColor="secondary"
      @click="$store.commit('openMyDeck')"
      class="open-my-deck"
    >
      My Deck
    </BaseButton>
    <v-bottom-sheet light :value="displayDeck" width="70%" @click:outside="$store.commit('closeMyDeck')" :persistent="myPlayer.mustDiscardHalfDeck">
      <v-sheet class="text-center" height="200px">
        <h2>
          {{ myPlayer.mustDiscardHalfDeck ? `Discard ${discardCardsNeeded} Cards` : null }}
        </h2>
        <v-btn
          text
          color="error"
          :disabled="myPlayer.mustDiscardHalfDeck"
          @click="$store.commit('closeMyDeck')"
          class="mt-6"
        >
          Close
        </v-btn>
        <v-btn
          v-if="myPlayer.mustDiscardHalfDeck"
          text
          color="success"
          :disalbed="selectedCards.length !== discardCardsNeeded"
          @click="onDiscard" 
          class="mt-6"
        >
          Discard
        </v-btn>
        <div class="wrapper">
          <BaseDeck :deck="myPlayer.resourceCounts" @card-clicked="toggleCardSelection($event)" :selectedCards="selectedCards" class="resources-deck" />
          <div v-for="purchaseType in purchaseTypes" :key="purchaseType" class="pieces">
            <GamePiece 
              size="30px"
              :type="purchaseType"
              :count="myPlayer[purchaseType]"
              :color="myPlayer.color"
            />
          </div>
          <GameCards
            v-if="myPlayer.gameCards && myPlayer.gameCards.length > 0"
            visible
            :deck="myPlayer.gameCards"
            class="game-cards"
          />
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </fragment>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import BaseDeck from '@/components/game/BaseDeck';
  import GameCards from '@/components/interface/GameCards';
  import GamePiece from '@/components/game/GamePiece';
  import BaseButton from '@/components/common/BaseButton';
  import { pluralTypes as purchaseTypes } from '@/specs/purchases';

  import { MESSAGE_DISCARD_HALF_DECK } from '@/constants';

  export default {
    name: 'MyDeck',
    components: {
      BaseDeck,
      GameCards,
      GamePiece,
      BaseButton
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
      },
      ...mapState([
        'myPlayer',
        'displayDeck'
      ])
    },
    created() {
      this.purchaseTypes = purchaseTypes;
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
      },
      onDiscard: function() {
        this.$store.commit('closeMyDeck');

        if (!this.myPlayer.mustDiscardHalfDeck) return;

        const discardedCounts = this.selectedCards.reduce((acc, { resource }) => {
          acc[resource]++;
          return acc;
        }, initialResourceCounts);

        colyseusService.room.send({
          type: MESSAGE_DISCARD_HALF_DECK,
          discardedCounts
        });

        this.selectedCards = [];
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wrapper {
    display: flex;

    .resources-deck {
      padding: $spacer;
    }
  }

  .pieces {
    padding: $spacer / 2;
    margin: $spacer / 2;
  }

  .game-cards {
    padding: $spacer / 2;
    margin: $spacer / 2;
    border-top: 1px solid lightgray;
  }

  .open-my-deck {
    transition: all 5ms ease-in-out;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: $font-size-lg;
    opacity: 1;
    animation: fade-in 2s linear ease-in-out;
  }
</style>
