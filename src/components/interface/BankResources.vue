<template>
  <div class="bank-resources">
    <div class="bank-trade">
      <BaseIcon name="bank" size="32px" color="white" />
      <div class="bank-trade-rate">
        {{ myPlayer.bankTradeRate }} : 1 
      </div>
    </div>
    <ResourceCounts
      v-if="sumValues(myPlayer.availableLoot) > 0"
      spaced
      collectable
      :clickable="false"
      :counts="myPlayer.availableLoot"
      @resource-clicked="$emit('collect-resource', $event)"
    />
    <ResourceCounts
      v-else
      spaced
      hideCounts
      :clickable="roomState.isGameStarted && isMyTurn"
      :counts="roomState.resourceCounts"
      @resource-clicked="$emit('bank-trading', $event)"
    />
    <BaseTooltip tooltip="Collect All">
      <BaseButton
        xs
        color="success"
        iconName="treasure-chest"
        iconColor="white"
        iconSize="x-large"
        :clickable="myPlayer.allowCollectAll && sumValues(myPlayer.availableLoot) > 0"
        @click="myPlayer.allowCollectAll && $emit('collect-all')"
        class="collect-all"
      />
    </BaseTooltip>
    <BaseTooltip tooltip="Development Cards">
      <GameCards
        :count="(roomState.gameCards || []).length"
        @purchase-game-card="$emit('purchase-game-card')"
        class="game-cards"
      />
    </BaseTooltip>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { sumValues } from '@/utils/objects';

  import GameCards from '@/components/interface/GameCards';
  import ResourceCounts from '@/components/interface/ResourceCounts';
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  import BaseTooltip from '@/components/common/BaseTooltip';

  export default {
    name: 'BankResources',
    components: {
      GameCards,
      ResourceCounts,
      BaseButton,
      BaseIcon,
      BaseTooltip
    },
    props: {
      isMyTurn: {
        type: Boolean,
        default: false
      },
    },
    computed: mapState([
      'roomState',
      'myPlayer'
    ]),
    created() {
      this.sumValues = sumValues;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .bank-resources {
    display: flex;
    align-items: center;

    .bank-trade {
      border-bottom: 1px solid $primary;
      display: flex;
      margin-right: $spacer;

      .bank-trade-rate {
        font-size: $font-size-md;
        color: $primary;
        padding-left: $spacer / 2;
        margin-right: $spacer;
      }
    }

    .collect-all {
      margin-left: $spacer;
      width: 100px;
      height: 50px;
    }

    .game-cards {
      margin-left: $spacer * 2;
    }
  }
</style>
