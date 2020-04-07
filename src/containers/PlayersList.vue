<template>
  <div class="players-wrapper">
    <ul class="players">
      <li
        v-for="(player, index) in players"
        :key="renderKey(player)"
        class="player-wrapper"
        :class="{ 'current-turn': currentTurn === index }"
      >
          {{ player.playerSessionId === myPlayer.playerSessionId }}

        <div v-if="player.playerSessionId === myPlayer.playerSessionId" class="yourself">
          YOU
        </div>
        <PlayerInfo
          :player="player"
          isMe
          :isStarted="isGameReady"
          @deck-clicked="player.playerSessionId === myPlayer.playerSessionId && $emit('display-deck')"
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
      isGameReady: {
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
        return `${player.playerSessionId}-${player.isReady}-${totalLoot}-${resourceCounts}-${player.roads}-${player.settlements}-${player.cities}`;
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
    height: 24%;
    border-radius: 20px;
    margin-top: $spacer / 2;
    background: #B0BEC5;
    position: relative;

    &.current-turn {
      box-shadow: 4px 4px 10px 10px lightgreen;
    }

    & + & {
      border-top: 1px solid gray;
    }

    .yourself {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>
