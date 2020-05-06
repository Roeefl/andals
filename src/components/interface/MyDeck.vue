<template>
  <fragment>
    <BaseButton
      v-show="!displayDeck"
      spaced
      color="warning"
      iconName="arrow-up-bold-box"
      iconSize="40px"
      iconColor="secondary"
      @click="$store.commit('openMyDeck')"
      class="open-my-deck"
    >
      My Deck
    </BaseButton>
    <v-bottom-sheet
      light
      :value="displayDeck"
      width="68%"
      @click:outside="!myPlayer.mustDiscardHalfDeck && $store.commit('closeMyDeck')"
      :persistent="myPlayer.mustDiscardHalfDeck"
      :overlay-opacity="0"
    >
      <v-sheet class="deck-sheet">
        <BaseButton
          icon
          iconName="arrow-down-bold-box"
          iconColor="primary"
          iconSize="40px"
          :disabled="myPlayer.mustDiscardHalfDeck"
          @click="$store.commit('closeMyDeck')"
          class="close-deck"
        ></BaseButton>
        <div class="deck-container">
          <BuildingCosts :full="false" :counts="myPlayer.resourceCounts" color="white" class="building-costs" />
          <div class="purchaseables">
            <div v-if="myPlayer.mustDiscardHalfDeck" class="discard">
              <h2 class="discard-header">
                Discard {{ discardCardsNeeded }} Cards
              </h2>
              <BaseButton
                color="error"
                iconName="checkbox-marked-circle-outline"
                iconColor="primary"
                iconSize="32px"
                :clickable="selectedCards.length === discardCardsNeeded"
                @click="onDiscard" 
              >
                Discard
              </BaseButton>
            </div>
            <BaseDeck collapsed :deck="myPlayer.resourceCounts" @card-clicked="toggleCardSelection($event)" :selectedCards="selectedCards" class="resources-deck" />
            <div class="game-pieces">
              <GamePiece 
                v-for="purchaseType in purchaseTypes"
                :key="purchaseType"
                :type="purchaseType"
                :showCount="false"
                :color="myPlayer.hasResources[purchaseType] ? '#43A047' : 'primary'"
                :size="purchaseType === 'gameCard' ? '100px' : '60px'"
                @clicked="onPieceClick(purchaseType)"
                class="game-piece"
                :class="purchaseType"
              ></GamePiece>
            </div>
          </div>
          <div class="playables">
            <GameCards
              v-if="myPlayer.gameCards && myPlayer.gameCards.length > 0"
              visible
              full
              :deck="myPlayer.gameCards"
              @game-card-clicked="playGameCard"
              class="player-cards"
            ></GameCards>
            <BaseButton color="transparent" height="auto" @click="$store.commit('setDisplayedHeroCard', myPlayer.currentHeroCard)" class="playable-wrapper">
              <HeroCard thumbnail :card="myPlayer.currentHeroCard || {}" class="hero-card" />
            </BaseButton>
          </div>
          <v-hover v-slot:default="{ hover }">
            <div class="offer-trade">
              <BaseButton icon iconName="swap-horizontal-circle" iconColor="white" iconSize="80px" />
              <span class="offer-trade-text">
                Request Trade
              </span>
              <ResourceSelect v-if="hover" :disabled="!isMyTurn" class="select-resource" :title="null" autoConfirm @resource-selected="onRequestTrade($event)" />
            </div>
          </v-hover>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </fragment>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import BaseDeck from '@/components/game/BaseDeck';
  import BuildingCosts from '@/components/interface/BuildingCosts';
  import ResourceSelect from '@/components/interface/ResourceSelect';
  import GameCards from '@/components/interface/GameCards';
  import HeroCard from '@/components/game/HeroCard';
  import GamePiece from '@/components/game/GamePiece';
  import BaseButton from '@/components/common/BaseButton';
  import { types as purchaseTypes, ROAD, SETTLEMENT, CITY, GAME_CARD, GUARD } from '@/specs/purchases';
  import { initialResourceCounts } from '@/specs/resources';

  import { MESSAGE_DISCARD_HALF_DECK, MESSAGE_TRADE_REQUEST_RESOURCE } from '@/constants';

  export default {
    name: 'MyDeck',
    components: {
      BaseDeck,
      BuildingCosts,
      GameCards,
      ResourceSelect,
      HeroCard,
      GamePiece,
      BaseButton
    },
    data: () => ({
      selectedCards: []
    }),
    props: {
      isMyTurn: {
        type: Boolean,
        default: false  
      }
    },
    computed: {
      discardCardsNeeded: function() {
        const totalCards = Object
          .values(this.myPlayer.resourceCounts)
          .reduce((r1, r2) => r1 + r2, 0);

        return Math.floor(totalCards / 2);
      },
      ...mapState([
        'roomState',
        'myPlayer',
        'displayDeck'
      ])
    },
    created() {
      this.purchaseTypes = purchaseTypes;
    },
    methods: {
      ...mapMutations([
        'addAlert'
      ]),
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
        console.log("discardedCounts", discardedCounts)

        colyseusService.room.send({
          type: MESSAGE_DISCARD_HALF_DECK,
          discardedCounts
        });

        this.selectedCards = [];
      },
      onPieceClick: function(type) {
        if (!this.isMyTurn) return;
        
        if (type === GAME_CARD) {
          this.$emit('purchase-game-card');
          return;
        }
      },
      playGameCard: function(gameCard) {
        const desiredGameCard = this.myPlayer.gameCards[gameCard.index];
        if (desiredGameCard.purchasedRound === this.roomState.currentRound) {
          this.addAlert('You cannot play a development card on the same round you purchased it');
          return;
        };

        this.$emit('play-game-card', gameCard);
      },
      onRequestTrade: function(requestedResource) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_REQUEST_RESOURCE,
          requestedResource
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $playable-card-size: 120px;

  .deck-sheet {
    background: rgba($secondary, 0.5);
    position: relative;

    .deck-container {
      height: 200px;
      padding: 0 $spacer;
      display: grid;
      grid-gap: 1%;
      grid-template-columns: 20% 40% 20% 17%;

      .building-costs {
        height: 200px;
      }

      .purchaseables {
        display: flex;
        flex-direction: column;

        .discard {
          display: flex;
          align-items: center;
          
          .discard-header {
            margin-right: $spacer * 2;
          }
        }

        .resources-deck {
          padding: $spacer;
        }

        .game-pieces {
          margin-top: $spacer;
          display: grid;
          grid-template-columns: 15% 15% 15% 15% 40%;
          place-items: center center;

          .game-piece {
            order: 1;

            &.gameCard {
              order: 2;
              justify-self: end;
            }
          }
        }
      }

      .playables {
        padding: $spacer;
        display: flex;
        justify-content: center;
        align-items: center;

        .player-cards {
          display: flex;
          width: $playable-card-size;
          height: $playable-card-size;
        }

        .playable-wrapper {
          padding: 0;
        }

        .hero-card {
          width: $playable-card-size;
          height: $playable-card-size;
          background: $secondary;
          color: $primary;
        }
      }

      .offer-trade {
        padding-top: $spacer * 3;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;

        .offer-trade-text {
          margin-top: $spacer;
          color: $primary;
          text-align: center;
        }
      }

      .select-resource {
        position: absolute;
        top: $spacer / 2;
        left: $spacer / 2;
        transform: translateX(-15%);
        width: 100%;
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
