<template>
  <div class="wrapper">
    <div class="building-costs">
      <ChoiceDialog iconName="wrench" title="Building Costs" :width="500">
        <BuildingCosts />
      </ChoiceDialog>
    </div>
    <div class="game-info">
      <div class="bank-resources">
        <Icon name="bank" size="32px" color="white" class="bank-icon" />
        <ResourceCounts :counts="roomState.resourceCounts" :clickable="false" spaced />
      </div>
    </div>
    <div class="room-stats">
      <RoomStats :roomTitle="roomState.roomTitle" :mySessionId="myPlayer.playerSessionId" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  import BuildingCosts from '@/components/interface/BuildingCosts';
  import RoomStats from '@/components/interface/RoomStats';
  import ResourceCounts from '@/components/interface/ResourceCounts';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import Icon from '@/components/common/Icon';

  export default {
    name: 'GameStatus',
    components: {
      ChoiceDialog,
      BuildingCosts,
      RoomStats,
      ResourceCounts,
      Icon
    },
    computed: mapState([
      'roomState',
      'myPlayer'
    ])
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wrapper {
    flex: 1;
    display: flex;
    align-items: center;

    .building-costs {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .game-info {
      flex: 3;
      padding-left: $spacer;
      display: flex;
      align-items: center;

      .bank-resources {
        display: flex;
        align-items: center;

        .bank-icon {
          margin-right: $spacer;
        }
      }
    }

    .room-stats {
      flex: 1;
    }
  }
</style>
