<template>
  <div class="control-panel">
    <div class="app-header-gap" />
    <div class="game-ui">
      <div class="building-costs">
        <ChoiceDialog iconName="wrench" title="Building Costs" buttonText="Building Costs" buttonColor="info" :width="500">
          <BuildingCosts />
        </ChoiceDialog>
      </div>
      <BankResources
        :isMyTurn="isMyTurn"
        @bank-trading="$emit('bank-trade', $event)"
        @collect-all="onCollectAllLoot"
        @collect-resource="collectResource($event)"
        @purchase-game-card="$emit('purchase-game-card')"
        class="bank-resources"
      />
    </div>
    <div class="game-actions">
      <div class="dice">
        <GameDice :dice="roomState.dice" :enabled="isDiceEnabled" @clicked="rollDice" />
        <RollingDice v-if="isDisplayDice" :type="roomState.roomType" @finished="$emit('dice-finished', $event)"/>
      </div>
      <div class="turn-action">
        <BaseButton v-if="roomState.isGameReady && !myPlayer.mustMoveRobber" color="red" @click="$emit('end-turn')" :clickable="!isEndTurnDisabled">
          End Turn
        </BaseButton>
        <BaseButton
          v-if="myPlayer.mustMoveRobber"
          color="primary"
          @click="$emit('move-robber')"
          :clickable="desiredRobberTile > -1 && roomState.robberPosition !== desiredRobberTile"
        >
          Move Robber
        </BaseButton>
        <BaseButton
          v-if="!roomState.isGameReady"
          :color="isSelfReady ? 'error' : 'highlight'"
          @click="$emit('toggle-ready')"
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

  import BankResources from '@/components/interface/BankResources';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BuildingCosts from '@/components/interface/BuildingCosts';
  import RollingDice from '@/components/interface/RollingDice';
  import GameDice from '@/components/interface/GameDice';
  import BaseButton from '@/components/common/BaseButton';

  import { MESSAGE_COLLECT_ALL_LOOT, MESSAGE_COLLECT_RESOURCE_LOOT } from '@/constants';
  import { diceColors } from '@/specs/dice';

  export default {
    name: 'ControlPanel',
    components: {
      BankResources,
      ChoiceDialog,
      BuildingCosts,
      RollingDice,
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
        return !this.roomState.isSetupPhase && this.isMyTurn && !this.roomState.isDiceRolled && !this.roomState.isVictory;
      },
      isEndTurnDisabled: function() {
        return (
          this.roomState.isTurnOrderPhase ||
          (this.roomState.isSetupPhase && (this.myPlayer.hasResources.road || this.myPlayer.hasResources.settlement || this.myPlayer.hasResources.guard)) ||
          // Game started - meaning: either its not even my turn, or it is but I have not played yet
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
        'isSelfReady'
      ])
    },
    data: () => ({
      isDisplayDice: false
    }),
    created() {
      this.diceColors = diceColors;
    },
    methods: {
      rollDice: function() {
        this.isDisplayDice = true;

        setTimeout(
          () => this.isDisplayDice = false,
          3000
        );
      },
      onCollectAllLoot: function() {
        colyseusService.room.send({
          type: MESSAGE_COLLECT_ALL_LOOT
        });
      },
      collectResource: function(resource) {
        colyseusService.room.send({
          type: MESSAGE_COLLECT_RESOURCE_LOOT,
          resource
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .control-panel {
    flex: 1;
    @include board-layout();

    .game-ui {
      padding-right: $spacer;
      display: grid;
      grid-template-columns: 20% 80%;
      place-items: center center;

      .building-costs {
        height: 50px;
      }

      .bank-resources {
        justify-self: end;
        margin-right: $spacer * 2;
      }
    }

    .game-actions {
      display: flex;
      justify-content: center;
      align-items: center;

      .dice {
        flex: 1;
        display: flex;
        justify-content: center;
      }

      .turn-action {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
