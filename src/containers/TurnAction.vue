<template>
  <div class="turn-action">
    <div v-if="isWaitingForDiceRoll" key="dice-needed" class="dice">
      <GameDice :dice="roomState.dice" @clicked="rollDice" />
    </div>
    <fragment v-else key="dice-rolled">
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
        <span v-if="isSelfReady" key="not-ready">
          Not Ready
        </span>
        <span v-else key="ready">
          I am Ready!
        </span>
      </BaseButton>
    </fragment>
    <audio ref="diceAudio">
      <source src="../assets/audio/dice.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import { isAllowRobberReset } from '@/utils/heroes';

  import GameDice from '@/components/interface/GameDice';
  import BaseButton from '@/components/common/BaseButton';

  import { ACTIVE_DICE_TIMEOUT } from '@/config';
  import { WILDLING_DICE_MAX } from '@/specs/dice';
  import { MESSAGE_MOVE_ROBBER, MESSAGE_ROLL_DICE } from '@/constants';
  
  export default {
    name: 'TurnAction',
    components: {
      GameDice,
      BaseButton
    },
    props: {
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
          this.isTurnOrderPhase ||
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
      ]),
      ...mapGetters([
        'isMyTurn',
        'isTurnOrderPhase'
      ])
    },
    methods: {
      ...mapMutations([
        'setActiveDice',
        'setActivePurchase'
      ]),
      ...mapActions([
        'finishTurn'
      ]),
      rollDice: function() {
        const dice = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * WILDLING_DICE_MAX) + 1
        ];

        this.setActiveDice({ who: this.myPlayer.playerSessionId, dice });
        const { diceAudio } = this.$refs;
        if (diceAudio) diceAudio.play(); 

        setTimeout(() => {
          colyseusService.room.send({
            type: MESSAGE_ROLL_DICE,
            dice
          });

          if (this.isTurnOrderPhase)
            this.finishTurn();

          this.setActiveDice(null);
        }, 2000);
      },
      moveRobber: function() {
        if (!this.myPlayer.mustMoveRobber) return;
        this.setActivePurchase(null);

        colyseusService.room.send({
          type: MESSAGE_MOVE_ROBBER,
          tile: this.desiredRobberTile
        });
      }
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
