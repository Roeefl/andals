<template>
  <div class="counts">
    Available Loot:
    <ResourceCard
      v-for="resource in resourceCardTypes"
      :key="resource"
      collectable
      :resource="resource"
      :count="counts[resource]"
      v-show="counts[resource] > 0"
      class="resource-card"
    />
    <Button
      color="transparent"
      iconName="treasure-chest"
      iconColor="red"
      iconSize="x-large"
      @click="$emit('collect-all')"
    />
  </div>
</template>

<script>
  import { resourceCardTypes, resourceCardColors } from '@/utils/tileManifest';
  import ResourceCard from '@/components/game/ResourceCard';
  import Button from '@/components/common/Button';
  import Icon from '@/components/common/Icon';

  export default {
    name: 'AvailableLoot',
    components: {
      ResourceCard,
      Button,
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
