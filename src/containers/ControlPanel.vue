<script>
  import colyseusService from '@/services/colyseus';

  import BankResources from '@/components/interface/BankResources';
  import GamePhase from '@/components/interface/GamePhase';

  import { MESSAGE_COLLECT_ALL_LOOT, MESSAGE_COLLECT_RESOURCE_LOOT } from '@/constants';

  export default {
    name: 'ControlPanel',
    components: {
      BankResources,
      GamePhase
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

<template>
  <header class="control-panel">
    <div class="app-header-gap" />
    <GamePhase class="game-action" />
    <BankResources
      @bank-trading="$emit('bank-trade', $event)"
      @collect-all="onCollectAllLoot"
      @collect-resource="collectResource($event)"
      class="bank-resources"
    />
  </header>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .control-panel {
    flex: 1;
    display: grid;
    grid-template-columns: 20% 30% 50%;
    place-items: center end;

    @include md-down() {
      grid-template-columns: repeat(3, 33%);
    }
    
    .game-action {
      width: 80%;
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .bank-resources {
      padding-right: $spacer * 2;
    }
  }
</style>
