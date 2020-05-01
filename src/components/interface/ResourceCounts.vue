<template>
  <div class="counts">
    <ResourceCard
      v-for="resource in resourceCardTypes"
      :key="resource"
      :resource="resource"
      :small="collapsed"
      :clickable="clickable"
      :maskCount="hideCounts"
      :hideCount="collapsed"
      :count="collapsed ? null : counts[resource]"
      @clicked="$emit('resource-clicked', resource)"
      class="resource-card"
      :class="{ 'spaced' : spaced, 'collapsed': collapsed }"
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
      },
      collapsed: {
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
    align-items: center;
  }

  .resource-card {
    &.spaced {
      & + & {
        margin-left: $spacer * 2;
      }
    }

    &.collapsed {
      & + & {
        margin-left: -$spacer;
      }
    }
  }
</style>
