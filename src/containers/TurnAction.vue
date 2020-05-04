<template>
  <div class="turn-action">
    <div v-if="isWaitingForDiceRoll" class="dice">
      <GameDice :dice="roomState.dice" @clicked="rollDice" enabled />
    </div>
    <fragment v-else>
      <BaseButton
        v-if="roomState.isGameReady && !myPlayer.mustMoveRobber"
        color="red"
        :width="buttonWidth"
        :height="buttonHeight"
        @click="finishTurn"
        :clickable="!isEndTurnDisabled"
      >
        Finish My Turn
      </BaseButton>
      <BaseButton
        v-if="myPlayer.mustMoveRobber"
        color="warning"
        :width="buttonWidth"
        :height="buttonHeight"
        @click="moveRobber"
        :clickable="isLegalRobberMove"
      >
        Move Robber
      </BaseButton>
      <BaseButton
        v-if="!roomState.isGameReady"
        :color="isSelfReady ? 'error' : '#558B2F'"
        :width="buttonWidth"
        :height="buttonHeight"
        @click="$emit('toggle-ready')"
      >
        <span v-if="isSelfReady">
          Not Ready
        </span>
        <span v-else>
          I am Ready!
        </span>
      </BaseButton>
    </fragment>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import { isAllowRobberReset } from '@/utils/heroes';

  import GameDice from '@/components/interface/GameDice';
  import BaseButton from '@/components/common/BaseButton';

  import {
    MESSAGE_FINISH_TURN,
    MESSAGE_MOVE_ROBBER
  } from '@/constants';
  
  export default {
    name: 'TurnAction',
    components: {
      GameDice,
      BaseButton
    },
    props: {
      isMyTurn: {
        type: Boolean,
        default: false  
      },
      buttonWidth: {
        type: String,
        default: '140px'
      },
      buttonHeight: {
        type: String,
        default: '60px'
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
      isWaitingForDiceRoll: function() {
        return !this.roomState.isSetupPhase && this.isMyTurn && !this.roomState.isDiceRolled && !this.roomState.isVictory;
      },
      isLegalRobberMove: function() {
        return (
          this.desiredRobberTile >= 0 &&
          this.roomState.robberPosition !== this.desiredRobberTile &&
          (isAllowRobberReset(this.myPlayer) || !!(this.roomState.board[this.desiredRobberTile].resource))
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
      ...mapMutations([
        'setRollingDice'
      ]),
      rollDice: function() {
        this.setRollingDice(true);

        setTimeout(
          () => this.setRollingDice(false),
          3000
        );
      },
      moveRobber: function() {
        if (!this.myPlayer.mustMoveRobber) return;

        colyseusService.room.send({
          type: MESSAGE_MOVE_ROBBER,
          tile: this.desiredRobberTile
        });
      },
      finishTurn: function() {
        colyseusService.room.send({
          type: MESSAGE_FINISH_TURN
        });

        this.$store.commit('setJustPurchasedGameCard', false);
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .turn-action {
    display: flex;

    .dice {
      flex: 1;
      display: flex;
      justify-content: center;
    }
  }
</style>
