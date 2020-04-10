<template>
  <div class="control">
    <div class="loot">
      <AvailableLoot :counts="myPlayer.availableLoot" @collect-all="collectAll" />
    </div>
    <div class="filler" />
    <div class="game-actions">
      <div class="dice">
        <GameDice v-if="isDisplayDice" @finished="$emit('dice-finished', $event)"/>
        <BaseButton
          v-for="(diceValue, i) in roomState.dice"
          :key="i"
          sm
          @click="rollDice"
          :iconName="`dice-${diceValue}`"
          :color="i === 0 ? 'deep-orange darken-3' : 'lime accent-3'"
          iconSize="50px"
          iconColor="black"
          :clickable="isDiceEnabled"
          class="cube"
        />
      </div>
      <div class="turn-action">
        <BaseButton v-if="roomState.isGameReady && !myPlayer.mustMoveRobber" color="red" @click="$emit('end-turn')" :clickable="!isEndTurnDisabled">
          End Turn
        </BaseButton>
        <BaseButton
          v-if="myPlayer.mustMoveRobber"
          color="pink darken-3"
          @click="$emit('move-robber')"
          :clickable="desiredRobberTile > -1 && roomState.robberPosition !== desiredRobberTile"
        >
          Move Robber
        </BaseButton>
        <BaseButton
          v-if="!roomState.isGameReady"
          :color="isSelfReady ? 'red' : 'green'"
          @click="() => $emit('toggle-ready')"
          class="ready"
        >
          <span v-if="isSelfReady">
            Not Ready
          </span>
          <span v-else>
            Ready!
          </span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import { MESSAGE_COLLECT_ALL_LOOT } from '@/store/constants';

  import AvailableLoot from '@/components/interface/AvailableLoot';
  import GameDice from '@/components/interface/GameDice';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'ControlPanel',
    components: {
      AvailableLoot,
      GameDice,
      BaseButton
    },
    props: {
      isMyTurn: {
        type: Boolean,
        default: false
      },
      desiredRobberTile: {
        type: Number,
        required: true
      }
    },
    computed: {
      isDiceEnabled: function() {
        return !this.roomState.isSetupPhase && this.isMyTurn && !this.roomState.isDiceRolled;
      },
      isEndTurnDisabled: function() {
        return (
          this.roomState.isTurnOrderPhase ||
          (this.roomState.isSetupPhase && this.myPlayer.hasResources.road) ||
          // Game started - meaning: either its not even my turn, or it is but I have not played yet
          !this.isMyTurn ||
          !this.roomState.isDiceRolled ||
          (this.myPlayer.mustMoveRobber && this.desiredRobberTile === -1) ||
          this.myPlayer.allowStealingFrom.length > 0
        );
      },
      ...mapState([
        'roomState',
        'myPlayer',
        'isSelfReady'
      ])
    },
    data: () => ({
      isDisplayDice: false
    }),
    methods: {
      rollDice: function() {
        this.isDisplayDice = true;

        setTimeout(
          () => this.isDisplayDice = false,
          3000
        );
      },
      collectAll: function() {
        colyseusService.room.send({
          type: MESSAGE_COLLECT_ALL_LOOT
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .control {
    flex: 1;
    display: grid;
    grid-template-columns: 30% 50% 20%;

    .loot {
      padding-left: $spacer;
      display: flex;
      align-items: center;
    }

    .game-actions {
      display: flex;
      justify-content: center;
      align-items: center;

      .dice {
        flex: 1;
        display: flex;
        justify-content: center;

        .cube {
          width: 54px;
          height: 54px;
          margin-right: $spacer / 3;
        }
      }

      .turn-action {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
