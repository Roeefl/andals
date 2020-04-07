<template>
  <div class="counts">
    Bank:
    <ResourceCard
      v-for="resource in resourceCardTypes"
      :key="resource"
      :resource="resource"
      :count="counts[resource]"
      class="resource-card"
    />
  </div>
</template>

<script>
  import { resourceCardTypes, resourceCardColors } from '@/utils/tileManifest';
  import ResourceCard from '@/components/game/ResourceCard';
  import Icon from '@/components/common/Icon';

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
