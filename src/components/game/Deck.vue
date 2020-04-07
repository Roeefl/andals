<template>
  <div class="deck">
    <div v-for="resource in resourceCardTypes" :key="resource" v-show="deck[resource]" class="resource-type">
      <ResourceCard
        v-for="(card, i) in Array(deck[resource]).fill(resource)"
        :key="`card-${i}`"
        :resource="resource"
        hideCount
        big
        class="resource-card"
        @clicked="$emit('card-clicked', resource)"
      />
    </div>
  </div>
</template>

<script>
  import { resourceCardTypes } from '@/utils/tileManifest';
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
  }

  .resource-card {
    & + & {
      margin-left: $spacer;
    }
  }

  .resource-type { 
    display: flex;
    margin-left: $spacer;
  }
</style>
