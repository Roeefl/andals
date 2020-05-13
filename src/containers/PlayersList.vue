<script>
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import PlayerInfo from '@/components/interface/PlayerInfo';
  import HeroCardDialog from '@/components/interface/HeroCardDialog';
  import TradeConfirm from '@/components/interface/TradeConfirm';
  import OpponentDeck from '@/components/interface/OpponentDeck';
  import GameDice from '@/components/interface/GameDice';
  import ResourceCard from '@/components/game/ResourceCard';
  import BaseOverlay from '@/components/common/BaseOverlay';
  import BaseButton from '@/components/common/BaseButton';

  import { mustGiveBackOnSteal } from '@/utils/heroes';

  import {
    MESSAGE_TRADE_START_AGREED,
    MESSAGE_TRADE_REQUEST_RESOURCE_RESPOND,
    MESSAGE_STEAL_CARD,
  } from '@/constants';

  export default {
    name: 'PlayersList',
    components: {
      PlayerInfo,
      HeroCardDialog,
      TradeConfirm,
      OpponentDeck,
      GameDice,
      ResourceCard,
      BaseOverlay,
      BaseButton,
    },
    props: {
      currentTurn: {
        type: Number,
        default: 0
      },
      waitingTradeWith: {
        type: String,
        default: null
      },
      isGameReady: {
        type: Boolean,
        default: false
      },
      currentRound: {
        type: Number,
        default: -1
      }
    },
    data: () => ({
      stealingFrom: {}
    }),
    computed: {
      playHeroCardAllowed: function() {
        return (
          this.isGameStarted &&
          this.isMyTurn &&
          !!this.myPlayer.currentHeroCard && this.displayedHeroCard.type === this.myPlayer.currentHeroCard.type &&
          !this.myPlayer.hasPlayedHeroCard &&
          this.displayedHeroCard.purchasedRound !== this.currentRound
        );
      },
      pendingTradeWith: function() {
        return this.myPlayer.pendingTrade
          ? (this.players.find(({ playerSessionId }) => playerSessionId === this.myPlayer.pendingTrade) || {}).nickname
          : 'NONE';
      },
      ...mapState([
        'myPlayer',
        'players',
        'displayedHeroCard',
        'justPurchasedGameCard',
        'recentLoot',
        'activeDice',
        'tradeRequested'
      ]),
      ...mapGetters([
        'isGameStarted',
        'myPlayerIndex',
        'isMyTurn',
        'allowRequestTrade'
      ]),
    },
    methods: {
      ...mapMutations([
        'setTradeRequested'
      ]),
      renderKey(player) {
        const resourceCounts = Object.values(player.resourceCounts).reduce((r1, r2) => r1 + r2, 0);
        return `${player.playerSessionId}-${player.isReady}-${resourceCounts}-${(player.currentHeroCard || { type: '' }).type}`;
      },
      playHeroCard: function(heroCard) {
        this.$store.commit('setDisplayedHeroCard', {});
        this.$emit('play-hero', heroCard);
      },
      respondToIncomingTrade: function(isAgreed) {
        colyseusService.room.send({
          type: MESSAGE_TRADE_START_AGREED,
          isAgreed
        });
      },
      respondToResourceTradeRequest: async function(isAgreed) {
        await colyseusService.room.send({
          type: MESSAGE_TRADE_REQUEST_RESOURCE_RESPOND,
          isAgreed,
          offeredResource: this.tradeRequested.requestedResource
        });

        this.setTradeRequested({});
      },
      stealResourceFrom: function(playerSessionId) {
        if (!mustGiveBackOnSteal(this.myPlayer)) {
          this.stealCard(playerSessionId);
          return;
        };

        this.stealingFrom = this.players.find(player => player.playerSessionId === playerSessionId);
      },
      confirmSteal: function(cards) {
        const { selectedCard, selectedGiveCard } = cards;
        const { resource } = selectedCard;

        this.stealCard(this.stealingFrom.playerSessionId, resource, (selectedGiveCard || {}).resource);
        this.stealingFrom = {};
      },
      stealCard: function(playerSessionId, resource, giveBack) {
        colyseusService.room.send({
          type: MESSAGE_STEAL_CARD,
          stealFrom: playerSessionId,
          resource,
          giveBack
        });
      }
    }
  }
</script>

<template>
  <div class="players-list">
    <ul class="other-players">
      <li
        v-for="(player, index) in players.filter(player => player.playerSessionId !== myPlayer.playerSessionId)"
        :key="renderKey(player)"
        class="player-wrapper"
        :class="{ 'current-turn': currentTurn === index }"
      >
        <PlayerInfo
          :player="player"
          :isGameStarted="isGameStarted"
          :isGameReady="isGameReady"
          :waitingTrade="myPlayer.isWaitingTradeRequest && player.playerSessionId === waitingTradeWith"
          :allowRequestTrade="allowRequestTrade"
          @trade-with="$emit('trade-with', $event)"
          @display-hero-card="$store.commit('setDisplayedHeroCard', $event)"
          class="player"
        />
        <BaseOverlay v-if="activeDice && activeDice.who && activeDice.who === player.playerSessionId" isOpen :isFullScreen="false" :opacity="0.7">
          <GameDice :dice="activeDice.dice" />
        </BaseOverlay>
        <BaseOverlay v-if="myPlayer.allowStealingFrom && myPlayer.allowStealingFrom.includes(player.playerSessionId)" isOpen :isFullScreen="false" :opacity="0.6">
          <BaseButton icon iconName="hand-okay" iconSize="64px" iconColor="warning" @click="stealResourceFrom(player.playerSessionId)" class="steal-button" />
        </BaseOverlay>
        <div class="trade-requests" :style="{ bottom: `${250 * (players.length - index)}px` }">
          <TradeConfirm
            v-if="!!myPlayer.pendingTrade"
            :withWho="pendingTradeWith"
            @no="respondToIncomingTrade(false)"
            @yes="respondToIncomingTrade(true)"
          />
          <TradeConfirm
            v-if="!!tradeRequested.senderSessionId"
            :withWho="tradeRequested.sender"
            :requestedResource="tradeRequested.requestedResource"
            @no="respondToResourceTradeRequest(false)"
            @yes="respondToResourceTradeRequest(true)"
          />
        </div>
      </li>
    </ul>      
    <div class="player-wrapper is-me" :class="{ 'current-turn': currentTurn === myPlayerIndex }">
      <PlayerInfo
        :player="myPlayer"
        isMe
        :currentRound="currentRound"
        :isGameReady="isGameReady"
        :isMyTurn="isMyTurn"
        @deck-clicked="$store.commit('openMyDeck')"
        @toggle-ready="$emit('toggle-ready')"
        @play-card="$emit('play-card', $event)"
        @display-hero-card="$store.commit('setDisplayedHeroCard', $event)"
        class="player"
      />
    </div>
    <HeroCardDialog
      v-if="!!displayedHeroCard.type"
      isOpen
      :card="displayedHeroCard"
      :playAllowed="playHeroCardAllowed"
      @play-hero="playHeroCard($event)"
      @close="$store.commit('setDisplayedHeroCard', {})"
    />
    <div class="recent-loot-cards" v-show="Object.keys(recentLoot).length > 0">
      <ResourceCard
        v-for="(card, key, index) in recentLoot"
        :key="`${key}-${index}`"
        recentLoot
        hideCount
        :resource="card.resource"
        class="recent-loot-card"
      />
    </div>
    <OpponentDeck
      :isOpen="!!stealingFrom.playerSessionId"
      giveBack
      :opponent="stealingFrom"
      :hideResources="!myPlayer.isVisibleSteal"
      :myDeck="myPlayer.resourceCounts"
      @steal="confirmSteal($event)"
      @cancel="stealingFrom = {}"
    />
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  $player-wrapper-height: 250px;

  $recent-loot-width: 120px;
  $recent-loot-height: 180px;

  .players-list {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;

    @include md-down() {
      flex-direction: row;
    }
    
    .other-players {
      display: flex;
      flex-direction: column;

      @include md-down() {
        flex-direction: row;
        flex: 1;
        height: 100%;
      }
    }

    .player-wrapper {
      height: $player-wrapper-height;
      overflow-y: hidden;
      margin-top: $spacer;
      display: flex;
      // transition: position 100ms ease-in-out;

      @include md-down() {
        max-height: unset;
        height: 100%;
      }

      &.is-me {
        height: 400px;
        max-height: unset;

        @include md-down() {
          height: 100%;
        }
      }

      &.current-turn {
        box-shadow: inset 8px 8px 40px 6px rgba(lightgreen, 1); 
      }

      .player {
        flex: 1;
        margin: 0 $spacer / 2;
        padding: $spacer / 2;
      }
    }
  }

  .recent-loot-cards {
    animation: slide-out-top 5s ease-out both;
    position: relative;
    z-index: $zindex-decor-overlay;
  }

  @mixin loot-positions() {
    @for $c from 0 to 6 {
      &:nth-child(#{$c + 1}) {
        bottom: calc(#{($recent-loot-height * 0.75) * -$c});
      }
    }
  }

  .recent-loot-card {
    position: absolute;
    bottom: 0;
    left: 240px;
    width: $recent-loot-width;
    height: $recent-loot-height;
    @include loot-positions();

    & + & {
      margin-left: 0;
    }
  }

  .steal-button {
    -webkit-animation: wobble-hor-bottom 4s cubic-bezier(0.470, 0.000, 0.745, 0.715) infinite both;
    animation: wobble-hor-bottom 4s cubic-bezier(0.470, 0.000, 0.745, 0.715) infinite both;
  }

  .trade-requests {
    position: absolute;
    right: 0;
    transform: translateX(100%) translateY(30%);
    z-index: $zindex-screen-overlay;
  }
</style>
