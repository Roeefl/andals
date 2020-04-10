<template>
  <div class="deck">
    <div v-for="resource in resourceCardTypes" :key="resource" v-show="deck[resource]" class="resource-type">
      <drag
        v-for="(card, index) in Array(deck[resource]).fill(resource)"
        :key="`card-${resource}-${index}`"
        :transfer-data="{ resource, index }"
        class="resource-card"
      >
        <ResourceCard
          :resource="resource"
          :selected="selectedCards.some(sel => sel.index === index && sel.resource === resource)"
          hideCount
          big
          :hideIcon="hideResources"
          @clicked="$emit('card-clicked', { resource, index })"
        />
      </drag>
    </div>
  </div>
</template>

<script>
  import { resourceCardTypes } from '@/specs/resources';
  import ResourceCard from '@/components/game/ResourceCard';

  export default {
    name: 'Deck',
    components: {
      ResourceCard
    },
    props: {
      deck: {
        type: Object,
        required: true
      },
      selectedCards: {
        type: Array,
        default: function() {
          return [];
        }
      },
      hideResources: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.resourceCardTypes = resourceCardTypes;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .deck {
    display: flex;
    padding-left: $spacer;
  }

  .resource-type { 
    display: flex;
  }

  .resource-card {
    margin-right: $spacer / 2;
  }
</style>
