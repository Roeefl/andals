<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import { isAllowRobberReset, isAllowMoveRobber } from '@/utils/heroes';

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
      allowFinishTurn: function() {
        return (
          this.isGameStarted &&
          this.isMyTurn &&
          this.roomState.isDiceRolled &&
          !this.myPlayer.mustMoveRobber &&
          !this.roomState.isVictory &&
          !this.myPlayer.allowStealingFrom.length
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
        'isGameStarted',
        'isMyTurn',
        'isTurnOrderPhase'
      ])
    },
    created() {
      this.isAllowMoveRobber = isAllowMoveRobber;
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
        if (!isAllowMoveRobber(this.myPlayer)) return;

        colyseusService.room.send({
          type: MESSAGE_MOVE_ROBBER,
          tile: this.desiredRobberTile
        });
        
        this.setActivePurchase(null);
      }
    }
  }
</script>

<template>
  <div class="turn-action">
    <div v-if="isWaitingForDiceRoll" key="dice-needed" class="dice">
      <GameDice :dice="roomState.dice" @clicked="rollDice" />
    </div>
    <fragment v-else key="dice-rolled">
      <BaseButton
        v-if="allowFinishTurn"
        color="red"
        :width="buttonWidth"
        :height="buttonHeight"
        @click="finishTurn"
      >
        Finish My Turn
      </BaseButton>
      <BaseButton
        v-if="isAllowMoveRobber(myPlayer)"
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
