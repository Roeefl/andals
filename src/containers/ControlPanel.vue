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
    </div>
  </div>
</template>

<script>
  import colyseusService from '@/services/colyseus';

  import BankResources from '@/components/interface/BankResources';
  import CurrentGameAction from '@/components/interface/CurrentGameAction';

  import { MESSAGE_COLLECT_ALL_LOOT, MESSAGE_COLLECT_RESOURCE_LOOT } from '@/constants';

  export default {
    name: 'ControlPanel',
    components: {
      BankResources,
      CurrentGameAction
    },
    props: {
      isMyTurn: {
        type: Boolean,
        default: false
      }
    },
    methods: {
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
    }
  }
</style>
