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
    <v-bottom-sheet light :value="displayDeck" width="68%" @click:outside="$store.commit('closeMyDeck')" :persistent="myPlayer.mustDiscardHalfDeck">
      <v-sheet class="deck-sheet">
        <BaseButton
          icon
          iconName="arrow-down-bold-box"
          iconColor="secondary"
          iconSize="40px"
          :disabled="myPlayer.mustDiscardHalfDeck"
          @click="$store.commit('closeMyDeck')"
          class="close-deck"
        />
        <div v-if="myPlayer.mustDiscardHalfDeck">
          <h2>
            Discard {{ discardCardsNeeded }} Cards
          </h2>
          <BaseButton
            icon
            iconName="discard"
            iconColor="success"
            iconSize="40px"
            :disabled="selectedCards.length !== discardCardsNeeded"
            @click="onDiscard" 
          >
            Discard
          </BaseButton>
        </div>
        <div class="deck-contents">
          <BuildingCosts :full="false" color="secondary" class="building-costs" />
          <BaseDeck :deck="myPlayer.resourceCounts" @card-clicked="toggleCardSelection($event)" :selectedCards="selectedCards" class="resources-deck" />
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
  import BuildingCosts from '@/components/interface/BuildingCosts';
  import GameCards from '@/components/interface/GameCards';
  import BaseButton from '@/components/common/BaseButton';
  import { pluralTypes as purchaseTypes } from '@/specs/purchases';
  import { initialResourceCounts } from '@/specs/resources';

  import { MESSAGE_DISCARD_HALF_DECK } from '@/constants';

  export default {
    name: 'MyDeck',
    components: {
      BaseDeck,
      BuildingCosts,
      GameCards,
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

  .deck-sheet {
    position: relative;

    .deck-contents {
      height: 200px;
      display: grid;
      grid-gap: $spacer;
      grid-template-columns: 25% 45% 15%;

      .resources-deck {
        padding: $spacer;
      }

      .building-costs {
        height: 200px;
      }

      .game-cards {
        border-left: 1px solid lightgray;
      }
    }
  }

  %toggle-button {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .open-my-deck {
    position: fixed;
    @extend %toggle-button;
    transition: all 5ms ease-in-out;
    font-size: $font-size-lg;
    opacity: 1;
    animation: fade-in 2s linear ease-in-out;
  }

  .close-deck {
    position: absolute;
    @extend %toggle-button;
  }
</style>
