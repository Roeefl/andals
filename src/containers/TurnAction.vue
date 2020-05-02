<template>
  <div class="turn-action">
    <BaseButton v-if="roomState.isGameReady && !myPlayer.mustMoveRobber" color="red" @click="finishTurn" :clickable="!isEndTurnDisabled">
      Finish My Turn
    </BaseButton>
    <BaseButton
      v-if="myPlayer.mustMoveRobber"
      color="primary"
      @click="moveRobber"
      :clickable="desiredRobberTile > -1 && roomState.robberPosition !== desiredRobberTile"
    >
      Move Robber
    </BaseButton>
    <BaseButton
      v-if="!roomState.isGameReady"
      :color="isSelfReady ? 'error' : 'highlight'"
      @click="$emit('toggle-ready')"
    >
      <span v-if="isSelfReady">
        Not Ready
      </span>
      <span v-else>
        Ready!
      </span>
    </BaseButton>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import BaseButton from '@/components/common/BaseButton';

  import {
    MESSAGE_FINISH_TURN,
    MESSAGE_MOVE_ROBBER
  } from '@/constants';

  export default {
    name: 'TurnAction',
    components: {
      BaseButton
    },
    props: {
      isMyTurn: {
        type: Boolean,
        default: false  
      }
    },
    computed: {
      isEndTurnDisabled: function() {
        return (
          this.roomState.isTurnOrderPhase ||
          (this.roomState.isSetupPhase && (this.myPlayer.hasResources.road || this.myPlayer.hasResources.settlement || this.myPlayer.hasResources.guard)) ||
          !this.isMyTurn ||
          (!this.roomState.isSetupPhase && !this.roomState.isDiceRolled) ||
          (this.myPlayer.mustMoveRobber && this.desiredRobberTile === -1) ||
          this.myPlayer.allowStealingFrom.length > 0 ||
          this.myPlayer.allowFreeRoads > 0 ||
          this.roomState.isVictory
        );
      },
      ...mapState([
        'roomState',
        'myPlayer',
        'isSelfReady',
        'desiredRobberTile'
      ])
    },
    methods: {
      finishTurn: function() {
        colyseusService.room.send({
          type: MESSAGE_FINISH_TURN
        });

        this.$store.commit('setJustPurchasedGameCard', false);
      },
      moveRobber: function() {
        if (!this.myPlayer.mustMoveRobber) return;

        colyseusService.room.send({
          type: MESSAGE_MOVE_ROBBER,
          tile: this.desiredRobberTile
        });
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .turn-action {
    display: flex;
  }
</style>
