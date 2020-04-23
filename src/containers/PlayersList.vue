<template>
  <div class="players-wrapper">
    <ul class="players">
      <li
        v-for="(player, index) in players"
        :key="renderKey(player)"
        class="player-wrapper"
        :class="{ 'current-turn': currentTurn === index }"
      >
        <PlayerInfo
          :player="player"
          :isMe="player.playerSessionId === myPlayer.playerSessionId"
          :enableTrading="isGameStarted"
          :waitingTrade="myPlayer.isWaitingTradeRequest && player.playerSessionId === waitingTradeWith"
          :isStarted="isGameReady"
          :allowStealing="myPlayer.allowStealingFrom.includes(player.playerSessionId)"
          @deck-clicked="player.playerSessionId === myPlayer.playerSessionId && $emit('display-deck')"
          @trade-with="$emit('trade-with', $event)"
          @steal-from="$emit('steal-from', $event)"
          :canPlayHero="isMyTurn"
          @play-hero="$emit('play-hero')"
          class="player"
        />
      </li>
    </ul>
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
      },
    },
    computed: mapState([
      'myPlayer',
      'players'
    ]),
    methods: {
      renderKey(player) {
        const totalLoot = Object.values(player.availableLoot).reduce((r1, r2) => r1 + r2, 0);
        const resourceCounts = Object.values(player.resourceCounts).reduce((r1, r2) => r1 + r2, 0);
        return `${player.playerSessionId}-${player.isReady}-${totalLoot}-${resourceCounts}-${player.roads}-${player.settlements}-${player.cities}-${player.guards}`;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .players-wrapper {
    height: 100%;
    padding-left: $spacer / 2;
    
    .players {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .player-wrapper {
    // flex: 1;
    overflow-y: hidden;
    height: 23%;
    margin-top: $spacer;
    position: relative;

    &.current-turn {
      box-shadow: 4px 4px 10px 10px lightgreen;
      // box-shadow: inset 8px 8px 40px 6px rgba(255, 0, 0, 1); 
    }

    .player {
      height: 100%;
    }
  }
</style>
