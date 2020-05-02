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
        @toggle-ready="$emit('toggle-ready')"
        @deck-clicked="$emit('display-deck')"
        @play-hero="$emit('play-hero', $event)"
        @play-card="playGameCard($event)"
        class="player"
      />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PlayerInfo from '@/components/interface/PlayerInfo';

  export default {
    name: 'PlayersList',
    components: {
      PlayerInfo,
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
    computed: {
      myPlayerIndex: function() {
        return this.players
          .findIndex(player => player.playerSessionId === this.myPlayer.playerSessionId);
      },
      ...mapState([
        'myPlayer',
        'players',
        'justPurchasedGameCard'
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .players-wrapper {
    height: 100%;
    
    .other-players {
      height: 50%;
      display: flex;
      flex-direction: column;
    }

    .player-wrapper {
      flex: 1;
      overflow-y: hidden;
      margin-top: $spacer;
      position: relative;
      display: flex;
      // transition: position 100ms ease-in-out;

      &.is-me {
        height: 50%;

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
</style>
