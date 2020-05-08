<template>
  <fragment>
    <BaseButton
      v-show="!displayDeck"
      spaced
      color="warning"
      iconName="arrow-up-bold-box"
      iconSize="40px"
      iconColor="secondary"
      @click="openMyDeck"
      class="open-my-deck"
    >
      My Deck
    </BaseButton>
    <v-bottom-sheet
      light
      :value="displayDeck"
      width="68%"
      @click:outside="!myPlayer.mustDiscardHalfDeck && closeMyDeck"
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
          @click="closeMyDeck"
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
              <BaseBadge v-if="!!activePurchase" color="primary">
                <PurchaseConfirm
                  :type="activePurchase.type"
                  :myPlayer="myPlayer"
                  :isFlexible="myPlayer.flexiblePurchase === activePurchase.type"
                  :selectionCount="myPlayer.isVisiblePurchaseGameCard ? 3 : 0"
                  :gameCards="roomState.gameCards"
                  @no="setActivePurchase(null)"
                  @yes="onConfirmPurchase($event)"
                />
              </BaseBadge>
            </div>
          </div>
          <div class="playables">
            <GameCards
              v-if="myPlayer.gameCards && myPlayer.gameCards.length > 0"
              visible
              full
              :deck="myPlayer.gameCards.filter(gameCard => gameCard.type !== CARD_VICTORY_POINT)"
              @game-card-clicked="playGameCard"
              class="game-cards"
            ></GameCards>
            <BaseButton color="transparent" height="auto" @click="$store.commit('setDisplayedHeroCard', myPlayer.currentHeroCard)" class="hero-card-wrapper">
              <HeroCard thumbnail :card="myPlayer.currentHeroCard || {}" class="hero-card" />
            </BaseButton>
          </div>
          <v-hover v-slot:default="{ hover }">
            <div class="offer-trade">
              <BaseButton icon iconName="swap-horizontal-circle" iconColor="white" iconSize="80px" />
              <span class="offer-trade-text">
                Request Trade
              </span>
              <ResourceSelect v-if="hover" :enabled="allowRequestTrade" class="select-resource" :title="null" autoConfirm @resource-selected="onRequestTrade($event)" />
            </div>
          </v-hover>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </fragment>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import BaseDeck from '@/components/game/BaseDeck';
  import BuildingCosts from '@/components/interface/BuildingCosts';
  import ResourceSelect from '@/components/interface/ResourceSelect';
  import GameCards from '@/components/interface/GameCards';
  import HeroCard from '@/components/game/HeroCard';
  import GamePiece from '@/components/game/GamePiece';
  import BaseButton from '@/components/common/BaseButton';
  import BaseBadge from '@/components/common/BaseBadge';
  import PurchaseConfirm from '@/components/interface/PurchaseConfirm';
  
  import { types as purchaseTypes, ROAD, SETTLEMENT, CITY, GAME_CARD, GUARD } from '@/specs/purchases';
  import { initialResourceCounts } from '@/specs/resources';
  import { CARD_VICTORY_POINT } from '@/specs/gameCards';

  import {
    MESSAGE_DISCARD_HALF_DECK,
    MESSAGE_TRADE_REQUEST_RESOURCE,
    MESSAGE_PURCHASE_GAME_CARD
  } from '@/constants';

  export default {
    name: 'MyDeck',
    components: {
      BaseDeck,
      BuildingCosts,
      GameCards,
      ResourceSelect,
      HeroCard,
      GamePiece,
      BaseButton,
      BaseBadge,
      PurchaseConfirm
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
        'roomState',
        'myPlayer',
        'displayDeck',
        'activePurchase'
      ]),
      ...mapGetters([
        'isGameStarted',
        'currentRound',
        'isMyTurn',
        'allowRequestTrade',
        'allowPurchaseGameCard'
      ])
    },
    created() {
      this.purchaseTypes = purchaseTypes;
      this.CARD_VICTORY_POINT = CARD_VICTORY_POINT;
    },
    methods: {
      ...mapMutations([
        'addAlert',
        'openMyDeck',
        'closeMyDeck',
        'setActivePurchase',
        'setJustPurchasedGameCard'
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
        this.closeMyDeck();

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
          if (!this.allowPurchaseGameCard) return;
          
          this.setActivePurchase({
            type: GAME_CARD
          });
        }
      },
      playGameCard: function(gameCard) {
        const desiredGameCard = this.myPlayer.gameCards[gameCard.index];
        if (desiredGameCard.purchasedRound === this.currentRound) {
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
      },
      onConfirmPurchase: function(gameCard) {
        const { type } = this.activePurchase;
        if (type !== GAME_CARD) return;
        
        colyseusService.room.send({
          type: MESSAGE_PURCHASE_GAME_CARD,
          selectedCardIndex: gameCard.index
        });

        this.setJustPurchasedGameCard(true);
        this.setActivePurchase(null);
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $playable-card-size: 80px;

  .deck-sheet {
    background: rgba($secondary, 0.5);
    position: relative;

    .deck-container {
      height: 200px;
      padding: 0 $spacer;
      display: grid;
      grid-gap: 1%;
      grid-template-columns: 20% 35% 25% 17%;

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
        justify-content: space-evenly;
        align-items: center;

        .hero-card-wrapper {
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
