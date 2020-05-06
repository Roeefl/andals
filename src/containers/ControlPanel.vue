<template>
  <div class="control-panel">
    <div class="app-header-gap" />
    <div class="game-ui">
      <BankResources
        :isMyTurn="isMyTurn"
        @bank-trading="$emit('bank-trade', $event)"
        @collect-all="onCollectAllLoot"
        @collect-resource="collectResource($event)"
        @purchase-game-card="$emit('purchase-game-card')"
        class="bank-resources"
      />
      <CurrentGameAction class="game-action" />
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
    display: grid;
    grid-template-columns: 17% 83%;

    @include lg-down() {
      grid-template-columns: 20% 80%;
    }

    .game-ui {
      padding-right: $spacer;
      display: grid;
      grid-template-columns: 60% 40%;
      align-items: center;

      @include md-down() {
        grid-template-columns: 70% 30%;
      }

      .bank-resources {
        margin-left: $spacer * 2;
      }
      
      .game-action {
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
