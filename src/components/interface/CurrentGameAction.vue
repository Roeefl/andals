

<template>
  <div class="container">
    <div class="base">
      {{ currentPlayer.nickname }} is:
    </div>
    <div v-if="!roomState.isDiceRolled">
      rolling the dice
    </div>
    <div v-else-if="currentPlayer.mustMoveRobber">
      moving the robber
    </div>
    <div v-else-if="currentPlayer.allowStealingFrom.length > 0">
      stealing a card
    </div>
    <div v-else-if="currentPlayer.allowFreeRoads > 0">
      building {{ currentPlayer.allowFreeRoads }} free roads
    </div>
    <div v-else>
      thinking
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

    .base {
      margin-right: $spacer;
    }
  }
</style>
