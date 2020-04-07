<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="600"
  >
    <ActionCard title="My Deck" @cancel="$emit('close')" @approve="$emit('close')">
      <div class="deck">
        <div v-for="resource in resourceCardTypes" :key="resource" v-show="deck[resource]" class="resource-type">
          <ResourceCard
            v-for="(card, i) in Array(deck[resource]).fill(resource)"
            :key="`card-${i}`"
            :resource="resource"
            hideCount
            big
            class="resource-card"
          />
        </div>
      </div>
    </ActionCard>
  </v-dialog>
</template>

<script>
  import buildingCosts from '@/utils/buildingCosts';
  import { resourceCardTypes } from '@/utils/tileManifest';

  import ActionCard from '@/components/common/ActionCard';
  import ResourceCard from '@/components/game/ResourceCard';

  export default {
    name: 'MyDeck',
    components: {
      ActionCard,
      ResourceCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      deck: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    created() {
      this.buildingCosts = buildingCosts;
      this.resourceCardTypes = resourceCardTypes;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .deck {
    display: flex;
  }

  .resource-card {
    & + & {
      margin-left: $spacer * 2;
    }
  }

  .resource-type { 
    display: flex;
    margin-left: $spacer;
  }
</style>
