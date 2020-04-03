<template>
  <div class="counts">
    <ResourceCard
      v-for="resource in resourceCardTypes"
      :key="resource"
      :resource="resource"
      :count="counts[resource] || '0'"
      class="resource-card"
    />
  </div>
</template>

<script>
  import { resourceCardTypes, resouceCardNameToIcon, resourceCardColors } from '@/utils/tileManifest';
  import ResourceCard from '@/components/ResourceCard';
  import Icon from '@/components/Icon';

  export default {
    name: 'ResourceCounts',
    components: {
      ResourceCard,
      Icon
    },
    props: {
      counts: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    created() {
      console.log(this.counts);
      this.resourceCardTypes = resourceCardTypes;
      this.resouceCardNameToIcon = resouceCardNameToIcon;
      this.resourceCardColors = resourceCardColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .counts {
    display: flex;
  }

  .resource-card {
    & + & {
      margin-left: $spacer;
    }
  }
</style>
