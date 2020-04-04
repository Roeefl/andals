<template>
  <div class="control">
    <div class="actions">
      <ChoiceDialog iconName="wrench" title="Building Costs">
        <BuildingCosts />
      </ChoiceDialog>
      <ResourceCounts :counts="roomState.resourceCounts" />
      <div class="dice" v-if="roomState.isGameReady">
        <Button color="success" :onClick="rollDice" :disabled="roomState.isSetupPhase || !isMyTurn || roomState.isDiceRolled">
          Roll Dice
        </Button>
        <Dice v-if="isDisplayDice" @finished="$emit('dice-finished', $event)"/>
        <div v-for="(diceValue, i) in roomState.dice" :key="i" class="cube" :class="`cube-${i}`">
          <Icon size="50px" color="black" :name="`dice-${diceValue}`" />
        </div>
      </div>
      <Button color="red" :onClick="() => $emit('end-turn')" :disabled="isEndTurnDisabled">
        End Turn
      </Button>
      <Button
        v-if="!roomState.isGameReady"
        :color="isSelfReady ? 'red' : 'green'"
        :onClick="() => $emit('toggle-ready')"
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

  import ResourceCounts from '@/components/ResourceCounts';
  import ChoiceDialog from '@/components/ChoiceDialog';
  import BuildingCosts from '@/components/BuildingCosts';
  import Dice from '@/components/Dice';
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';

  export default {
    name: 'ControlPanel',
    components: {
      ResourceCounts,
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
      }
    },
    computed: {
      isEndTurnDisabled: function() {
        return (
          this.roomState.isTurnOrderPhase ||
          (this.roomState.isSetupPhase && this.myPlayer.hasResources.road) ||
          // Game started - meaning: either its not even my turn, or it is but I have not played yet
          !this.isMyTurn ||
          !this.roomState.isDiceRolled
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
          border: 1px solid black;
          display: flex;
          justify-content: center;
          align-items: center;

          &.cube-0 {
            background: rgba(yellow, 0.5);
          }

          &.cube-1 {
            background: rgba(red, 0.5);
          }
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
