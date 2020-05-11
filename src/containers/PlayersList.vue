<script>
  import { mapState, mapGetters } from 'vuex';
  import PlayerInfo from '@/components/interface/PlayerInfo';
  import HeroCardDialog from '@/components/interface/HeroCardDialog';
  import ResourceCard from '@/components/game/ResourceCard';
  import BaseOverlay from '@/components/common/BaseOverlay';
  import GameDice from '@/components/interface/GameDice';

  export default {
    name: 'PlayersList',
    components: {
      PlayerInfo,
      HeroCardDialog,
      ResourceCard,
      BaseOverlay,
      GameDice
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
      ...mapState([
        'myPlayer',
        'players',
        'displayedHeroCard',
        'justPurchasedGameCard',
        'recentLoot',
        'activeDice'
      ]),
      ...mapGetters([
        'isGameStarted',
        'myPlayerIndex',
        'isMyTurn',
        'allowRequestTrade'
      ]),
    },
    methods: {
      renderKey(player) {
        const resourceCounts = Object.values(player.resourceCounts).reduce((r1, r2) => r1 + r2, 0);
        return `${player.playerSessionId}-${player.isReady}-${resourceCounts}-${(player.currentHeroCard || { type: '' }).type}`;
      },
      playHeroCard: function(heroCard) {
        this.$store.commit('setDisplayedHeroCard', {});
        this.$emit('play-hero', heroCard);
      }
    }
  }
</script>

<template>
  <div class="players-wrapper">
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
          :allowStealing="myPlayer.allowStealingFrom && myPlayer.allowStealingFrom.includes(player.playerSessionId)"
          :allowRequestTrade="allowRequestTrade"
          @trade-with="$emit('trade-with', $event)"
          @steal-from="$emit('steal-from', $event)"
          @display-hero-card="$store.commit('setDisplayedHeroCard', $event)"
          class="player"
        />
        <BaseOverlay v-if="activeDice && activeDice.who && activeDice.who === player.playerSessionId" isOpen :isFullScreen="false" :opacity="0.7">
          <GameDice :dice="activeDice.dice" />
        </BaseOverlay>
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
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .players-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    @include md-down() {
      flex-direction: row;
    }
    
    .other-players {
      display: flex;
      flex-direction: column;
      height: 50%;

      @include md-down() {
        flex-direction: row;
        flex: 1;
        height: 100%;
      }
    }

    .player-wrapper {
      flex: 1;
      max-height: 50%;
      overflow-y: hidden;
      margin-top: $spacer;
      position: relative;
      display: flex;
      // transition: position 100ms ease-in-out;

      @include md-down() {
        max-height: unset;
        height: 100%;
      }

      &.is-me {
        height: 50%;
        max-height: unset;

        @include md-down() {
          height: 100%;
        }

        // &:hover {
        //   position: absolute;
        //   bottom: $spacer * 2;
        //   left: $spacer;
        //   background: $secondary;
        //   border: 1px solid black;
        //   width: 25vw;
        //   // height: 47vh;
        //   z-index: 230;
        // }
      }

      &.current-turn {
        box-shadow: 4px 4px 10px 10px lightgreen;
        // box-shadow: inset 8px 8px 40px 6px rgba(255, 0, 0, 1); 
      }

      .player {
        flex: 1;
        margin: 0 $spacer / 2;
        padding: $spacer / 2;
      }
    }
  }

  .recent-loot-cards {
    animation: slide-out-top 6s ease-out both;
    position: relative;
    z-index: $zindex-decor-overlay;
  }

  .recent-loot-card {
    position: absolute;
    left: 240px;
    width: 120px;
    height: 180px;
    
    & + & {
      margin-left: 0;
      margin-top: 140px;
    }
  }
</style>
