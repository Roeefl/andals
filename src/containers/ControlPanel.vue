<template>
  <div class="control-panel">
    <div class="app-header-gap" />
    <div class="game-ui">
      <CurrentGameAction  />
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
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import BankResources from '@/components/interface/BankResources';
  import CurrentGameAction from '@/components/interface/CurrentGameAction';
  import RollingDice from '@/components/interface/RollingDice';
  import GameDice from '@/components/interface/GameDice';

  import { MESSAGE_COLLECT_ALL_LOOT, MESSAGE_COLLECT_RESOURCE_LOOT } from '@/constants';

  export default {
    name: 'ControlPanel',
    components: {
      BankResources,
      CurrentGameAction,
      RollingDice,
      GameDice
    },
    props: {
      isMyTurn: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isDiceEnabled: function() {
        return !this.roomState.isSetupPhase && this.isMyTurn && !this.roomState.isDiceRolled && !this.roomState.isVictory;
      },
      ...mapState([
        'players',
        'roomState'
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
      grid-template-columns: 30% 70%;
      align-items: center;

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
        background: $primary;
      }
    }
  }
</style>
