<template>
  <div class="bank-resources">
    <BaseIcon name="bank" size="32px" color="white" />
    <div class="bank-trade-rate">
      {{ myPlayer.bankTradeRate }} : 1 
    </div>
    <ResourceCounts spaced hideCounts :counts="roomState.resourceCounts" @resource-clicked="$emit('bank-trading', $event)" />
    <GameCards
      :count="(roomState.gameCards || []).length"
      :allowed="isCardPurchaseEnabled"
      @purchase-game-card="$emit('purchase-game-card')"
      class="game-cards"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  import GameCards from '@/components/interface/GameCards';
  import ResourceCounts from '@/components/interface/ResourceCounts';
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'BankResources',
    components: {
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

  .bank-resources {
    display: flex;
    align-items: center;

    .bank-trade-rate {
      font-size: $font-size-md;
      color: $primary;
      padding-left: $spacer / 2;
      margin-right: $spacer;
    }

    .game-cards {
      margin-left: $spacer * 2;
    }
  }
</style>
