<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="500"
  >
    <ActionCard :title="title" @cancel="$emit('no')" @approve="$emit('yes')">
      <h2 v-if="!requestedResource" key="direct-trade">
        Confirm Trade with {{ withWho }}
      </h2>
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
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import ResourceCard from '@/components/game/ResourceCard';

  export default {
    name: 'TradeConfirm',
    components: {
      ActionCard,
      ResourceCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      withWho: {
        type: String,
        default: ''
      },
      requestedResource: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: 'Confirm Trade'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  
  .requested-resource {
    padding: $spacer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>