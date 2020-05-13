<script>
  import BaseButton from '@/components/common/BaseButton';
  import ResourceCard from '@/components/game/ResourceCard';

  export default {
    name: 'TradeConfirm',
    components: {
      BaseButton,
      ResourceCard,
    },
    props: {
      withWho: {
        type: String,
        default: ''
      },
      requestedResource: {
        type: String,
        default: null
      }
    }
  }
</script>

<template>
  <div class="trade-confirm">
    <h3 v-if="!requestedResource" key="direct-trade">
      {{ withWho }} is asking to trade with you
    </h3>
    <div v-else key="requested-trade" class="requested-resource">
      <h3>
        {{ withWho }} is asking if anyone is willing to trade a
      </h3>
      <div class="resource-card-wrapper">
        <ResourceCard
          hideCount
          :resource="requestedResource"
          @clicked="onResourceClick(resource)"
        ></ResourceCard>
      </div>
    </div>
    <div class="confirm-actions">
      <BaseButton
        icon
        iconName="cancel"
        iconColor="red"
        iconSize="40px"
        @click="$emit('no')"
      />
      <BaseButton
        icon
        iconName="check"
        iconSize="40px"
        iconColor="light-green darken-2"
        @click="$emit('yes')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .trade-confirm {
    padding: $spacer;
    width: 240px;
    display: flex;
    flex-direction: column;
    background: $secondary;
    opacity: 0.8;
    z-index: $zindex-screen-overlay;
    border-radius: 20px;

    .requested-resource {
      padding: $spacer;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .confirm-actions {
      display: flex;
      justify-content: space-evenly;
    }
  }
</style>