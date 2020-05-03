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
          :enableTrading="isGameStarted"
          :isGameReady="isGameReady"
          :waitingTrade="myPlayer.isWaitingTradeRequest && player.playerSessionId === waitingTradeWith"
          :allowStealing="myPlayer.allowStealingFrom && myPlayer.allowStealingFrom.includes(player.playerSessionId)"
          @trade-with="$emit('trade-with', $event)"
          @steal-from="$emit('steal-from', $event)"
          @display-hero-card="displayedHeroCard = $event"
          class="player"
        />
      </li>
    </ul>
    <div class="player-wrapper is-me" :class="{ 'current-turn': currentTurn === myPlayerIndex }">
      <PlayerInfo
        :player="myPlayer"
        isMe
        :isGameReady="isGameReady"
        :isMyTurn="isMyTurn"
        @deck-clicked="$store.commit('openMyDeck')"
        @toggle-ready="$emit('toggle-ready')"
        @play-card="playGameCard($event)"
        @display-hero-card="displayedHeroCard = $event"
        class="player"
      />
    </div>
    <HeroCardDialog
      :isOpen="!!displayedHeroCard.type"
      :card="displayedHeroCard"
      :playAllowed="displayedHeroCard.type === (myPlayer.currentHeroCard || {}).type && isMyTurn && !myPlayer.hasPlayedHeroCard"
      @play-hero="playHeroCard($event)"
      @close="displayedHeroCard = {}"
    />
    <ResourceCard
      v-for="(card, key, index) in recentLoot"
      :key="`${key}-${index}`"
      :resource="card.resource"
      :count="card.count"
      :clickable="false"
      class="recent-loot-card"
      :class="`recent-loot-card-${index}`"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PlayerInfo from '@/components/interface/PlayerInfo';
  import HeroCardDialog from '@/components/interface/HeroCardDialog';
  import ResourceCard from '@/components/game/ResourceCard';

  export default {
    name: 'PlayersList',
    components: {
      PlayerInfo,
      HeroCardDialog,
      ResourceCard
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
      isGameStarted: {
        type: Boolean,
        default: false
      },
      isMyTurn: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      displayedHeroCard: {}
    }),
    computed: {
      myPlayerIndex: function() {
        return this.players
          .findIndex(player => player.playerSessionId === this.myPlayer.playerSessionId);
      },
      ...mapState([
        'myPlayer',
        'players',
        'justPurchasedGameCard',
        'recentLoot'
      ])
    },
    methods: {
      renderKey(player) {
        const totalLoot = Object.values(player.availableLoot).reduce((r1, r2) => r1 + r2, 0);
        const resourceCounts = Object.values(player.resourceCounts).reduce((r1, r2) => r1 + r2, 0);
        const gamePieces = player.roads + player.settlements + player.cities + player.guards;

        return `${player.playerSessionId}-${player.isReady}-${totalLoot}-${resourceCounts}-${gamePieces}-${(player.currentHeroCard || {}).name}`;
      },
      playGameCard: function(gameCard) {
        const lastCardIndex = this.myPlayer.gameCards.length - 1;
        if (this.justPurchasedGameCard && gameCard.index === lastCardIndex) {
          this.$store.commit('addAlert', 'You cannot play a development card on the same round you purchased it');
          return;
        };

        this.$emit('play-card', gameCard);
      },
      playHeroCard: function(heroCard) {
        this.displayedHeroCard = {};
        this.$emit('play-hero', heroCard);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .players-wrapper {
    height: 100%;
    width: 100%;
    
    .other-players {
      height: 50%;
      display: flex;
      flex-direction: column;
    }

    .player-wrapper {
      flex: 1;
      max-height: 200px;
      overflow-y: hidden;
      margin-top: $spacer;
      position: relative;
      display: flex;
      // transition: position 100ms ease-in-out;

      &.is-me {
        height: 50%;
        max-height: unset;

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

  // @mixin recent-loot-cards() {
  //   @for $t from 0 to 10 {
  //     &:nth-child(#{$t + 1}) {
  //       animation-delay: #{$t + 1}s;
  //     }
  //   }
  // }

  .recent-loot-card {
    width: 160px;
    height: 240px;
    position: absolute;
    left: 15%;
    -webkit-animation: slide-up-and-fade-out 7s ease both;
    animation: slide-up-and-fade-out 7s ease both;
    // @include recent-loot-cards();

    &.recent-loot-card-1 {
      animation-delay: 1s;
    }

    &.recent-loot-card-2 {
      animation-delay: 2s;
    }

    &.recent-loot-card-3 {
      animation-delay: 3s;
    }
  }
</style>
