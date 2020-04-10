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
        <GameCards
          :count="(roomState.gameCards || []).length"
          :allowed="isCardPurchaseEnabled"
          @purchase-card="$emit('purchase-card')"
          class="game-cards"
        />
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
  import GameCards from '@/components/interface/GameCards';
  import ResourceCounts from '@/components/interface/ResourceCounts';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'GameStatus',
    components: {
      ChoiceDialog,
      BuildingCosts,
      RoomStats,
      GameCards,
      ResourceCounts,
      Icon
    },
    props: {
      isMyTurn: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      isCardPurchaseEnabled: function() {
        return (
          this.isMyTurn &&
          !this.roomState.isSetupPhase &&
          this.roomState.isDiceRolled &&
          this.myPlayer.hasResources.gameCard &&
          !this.myPlayer.mustMoveRobber
        );
      },
      ...mapState([
        'roomState',
        'myPlayer'
      ])
    }
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

        .game-cards {
          margin-left: $spacer * 2;
        }
      }
    }

    .room-stats {
      flex: 1;
    }
  }
</style>
