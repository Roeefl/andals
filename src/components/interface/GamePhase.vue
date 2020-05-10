<script>
  import { mapState } from 'vuex';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'GamePhase',
    components: {
      BaseButton
    },
    computed: {
      currentPlayer: function() {
        if (!this.players.length) return {};
        return this.players[this.roomState.currentTurn];
      },
      ongoingTrade: function() {
        const tradingPlayer = this.players.find(player => !!player.tradingWith);
        if (!tradingPlayer) return false;

        const tradingWith = this.players.find(({ playerSessionId }) => playerSessionId === tradingPlayer.tradingWith);
        if (!tradingWith) return false;

        return `${tradingPlayer.nickname} and ${tradingWith.nickname} are trading`;
      },
      ...mapState([
        'players',
        'roomState'
      ])
    },
  }
</script>

<template>
  <div class="container">
    <div v-if="!roomState || !roomState.isGameReady" key="preparing" class="action-wrapper">
      Game Setting Up
    </div>
    <div v-else-if="roomState.isTurnOrderPhase" key="turn-order" class="action-wrapper">
      Setting up up turn order
    </div>
    <div v-else-if="roomState.isSetupPhase" key="setup-phase" class="action-wrapper">
      <div class="base">
        {{ currentPlayer.nickname }} is placing a
      </div>
      <div v-for="(value, key) in currentPlayer.hasResources" :key="key" v-show="value">
        {{ key }}
      </div>
    </div>
    <div v-else-if="ongoingTrade" key="ongoing-trade">
      {{ ongoingTrade }}
    </div>
    <div v-else key="in-game" class="action-wrapper">
      <div class="base">
        {{ currentPlayer.nickname }} is:
      </div>
      <div v-if="!roomState.isDiceRolled" key="rolling-dice">
        rolling the dice
      </div>
      <div v-else-if="currentPlayer.mustMoveRobber" key="moving-robber">
        moving the robber
      </div>
      <div v-else-if="currentPlayer.allowStealingFrom && currentPlayer.allowStealingFrom.length > 0" key="stealing">
        stealing a card
      </div>
      <div v-else-if="currentPlayer.allowFreeRoads > 0" key="building">
        building {{ currentPlayer.allowFreeRoads }} free roads
      </div>
      <div v-else key="thinking">
        thinking
      </div>
    </div>
    ...
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .container {
    display: flex;
    font-size: $font-size-lg;
    box-shadow: 0px 0px 6px 6px $highlight;
    padding: 0 $spacer;

    .action-wrapper {
      display: flex;
    }

    .base {
      margin-right: $spacer / 2;
    }
  }
</style>
