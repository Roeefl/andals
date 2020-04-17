<template>
  <div class="game-status">
    <div class="building-costs">
      <ChoiceDialog iconName="wrench" title="Building Costs" buttonText="Building Costs" :width="500">
        <BuildingCosts />
      </ChoiceDialog>
    </div>
    <div class="game-info">
      <div class="bank-resources">
        <BaseIcon name="bank" size="32px" color="white" class="bank-icon" />
        <ResourceCounts spaced hideCounts :counts="roomState.resourceCounts" @resource-clicked="$emit('bank-trading', $event)" />
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
      BaseIcon
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

  .game-status {
    flex: 1;
    height: 100%;
    display: grid;
    grid-template-columns: 20% 60% 20%;
    color: $app-background;

    .building-costs {
      display: flex;
      justify-content: center;
    }

    .game-info {
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
  }
</style>
