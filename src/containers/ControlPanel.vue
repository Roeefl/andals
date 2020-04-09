<template>
  <div class="control">
    <div class="actions">
      <ChoiceDialog iconName="wrench" title="Building Costs" :width="500">
        <BuildingCosts />
      </ChoiceDialog>
      <ResourceCounts :counts="roomState.resourceCounts" />
      <AvailableLoot :counts="myPlayer.availableLoot" @collect-all="collectAll" />
      <div class="dice" v-if="roomState.isGameReady">
        <Dice v-if="isDisplayDice" @finished="$emit('dice-finished', $event)"/>
        <Button
          v-for="(diceValue, i) in roomState.dice"
          :key="i"
          :disabled="roomState.isSetupPhase || !isMyTurn || roomState.isDiceRolled"
          @click="rollDice"
          :iconName="`dice-${diceValue}`"
          :color="i === 0 ? 'deep-orange darken-3' : 'lime accent-3'"
          iconSize="50px"
          iconColor="black"
          class="cube"
        />
      </div>
      <Button color="red" @click="$emit('end-turn')" :disabled="isEndTurnDisabled">
        End Turn
      </Button>
      <Button
        v-if="myPlayer.mustMoveRobber"
        color="pink darken-3"
        @click="$emit('move-robber')"
        :disabled="desiredRobberTile === -1 || roomState.robberPosition === desiredRobberTile"
      >
        Move Robber
      </Button>
      <Button
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
      </Button>
    </div>
    <div class="room-stats">
      <span>
        You are in: {{ roomState.roomTitle }}
      </span>
      <span>
        Your PlayerSessionID is: {{ myPlayer.playerSessionId }}
      </span>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import { MESSAGE_COLLECT_ALL_LOOT } from '@/store/constants';

  import ResourceCounts from '@/components/interface/ResourceCounts';
  import AvailableLoot from '@/components/interface/AvailableLoot';
  import Dice from '@/components/interface/Dice';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BuildingCosts from '@/components/interface/BuildingCosts';
  import Button from '@/components/common/Button';
  import Icon from '@/components/common/Icon';

  export default {
    name: 'ControlPanel',
    components: {
      ResourceCounts,
      AvailableLoot,
      ChoiceDialog,
      BuildingCosts,
      Dice,
      Button,
      Icon
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
    display: flex;
    justify-content: space-between;

    .actions {
      display: flex;

      & > * {
        margin-left: $spacer * 3;
      }

      .dice {
        display: flex;

        .cube {
          width: 64px;
          height: 64px;
          margin-right: $spacer / 3;
        }
      }
    }

    .room-stats {
      border: 1px solid black;
      padding: 0 $spacer;
      display: flex;
      flex-direction: column;
    }
  }
</style>
