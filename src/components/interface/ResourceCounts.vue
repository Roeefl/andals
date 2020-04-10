<template>
  <div class="counts">
    <ResourceCard
      v-for="resource in resourceCardTypes"
      :key="resource"
      :resource="resource"
      :clickable="clickable"
      :hideCount="hideCounts"
      :count="counts[resource]"
      @clicked="$emit('clicked')"
      class="resource-card"
      :class="{ 'spaced' : spaced }"
    />
  </div>
</template>

<script>
  import { resourceCardTypes } from '@/specs/resources';
  import ResourceCard from '@/components/game/ResourceCard';
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'ResourceCounts',
    components: {
      ResourceCard,
      BaseIcon
    },
    props: {
      counts: {
        type: Object,
        default: function() {
          return {};
        }
      },
      clickable: {
        type: Boolean,
        default: true
      },
      hideCounts: {
        type: Boolean,
        default: false
      },
      spaced: {
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

  .counts {
    display: flex;
  }

  .resource-card {
    &.spaced {
      & + & {
        margin-left: $spacer * 2;
      }
    }
  }
</style>
