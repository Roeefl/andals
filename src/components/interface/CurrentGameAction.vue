

<template>
  <div class="container">
    <div v-if="!roomState || !roomState.isGameReady" class="action-wrapper">
      Game Setting Up
    </div>
    <div v-else-if="roomState.isTurnOrderPhase" class="action-wrapper">
      Setting up up turn order
    </div>
    <div v-else-if="roomState.isSetupPhase" class="action-wrapper">
      <div class="base">
        {{ currentPlayer.nickname }} is placing a
      </div>
      <div v-for="(value, key) in currentPlayer.hasResources" :key="key" v-show="value">
        {{ key }}
      </div>
    </div>
    <div v-else class="action-wrapper">
      <div class="base">
        {{ currentPlayer.nickname }} is:
      </div>
      <div v-if="!roomState.isDiceRolled">
        rolling the dice
      </div>
      <div v-else-if="currentPlayer.mustMoveRobber">
        moving the robber
      </div>
      <div v-else-if="currentPlayer.allowStealingFrom && currentPlayer.allowStealingFrom.length > 0">
        stealing a card
      </div>
      <div v-else-if="currentPlayer.allowFreeRoads > 0">
        building {{ currentPlayer.allowFreeRoads }} free roads
      </div>
      <div v-else>
        thinking
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'CurrentGameAction',
    components: {
      BaseButton
    },
    computed: {
      currentPlayer: function() {
        if (!this.players.length) return {};
        return this.players[this.roomState.currentTurn];
      },
      ...mapState([
        'players',
        'roomState'
      ])
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .container {
    display: flex;
    font-size: $font-size-lg;
    box-shadow: 0px 0px 6px 6px $highlight;
    padding: 0 $spacer;
    background: $primary;
    color: $secondary;

    .action-wrapper {
      display: flex;
    }

    .base {
      margin-right: $spacer / 2;
    }
  }
</style>
