<template>
  <div class="players-wrapper">
    <ul class="players">
      <li
        v-for="(player, index) in players"
        :key="`player-${player.playerSessionId}-${player.isReady}`"
        class="player-wrapper"
        :class="{ 'current-turn': currentTurn === index }"
      >
        <PlayerInfo :player="player" :resourceCounts="player.resourceCounts" :isStarted="isGameReady" />
      </li>
    </ul>
  </div>
</template>

<script>
  import PlayerInfo from '@/components/PlayerInfo';

  export default {
    name: 'PlayersList',
    components: {
      PlayerInfo,
    },
    props: {
      players: {
        type: Array,
        default: []
      },
      currentTurn: {
        type: Number,
        default: 0
      },
      isGameReady: {
        type: Boolean,
        default: false
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

    &.current-turn {
      background: red;
    }

    & + & {
      border-top: 1px solid gray;
    }
  }
</style>
