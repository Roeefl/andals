<template>
  <div class="counts">
    <BaseButton
      xs
      color="red accent-3"
      iconName="treasure-chest"
      iconColor="white"
      iconSize="x-large"
      :clickable="collectAll && hasAnyLoot"
      @click="collectAll && $emit('collect-all')"
      class="collect-all"
    />
    <ResourceCard
      v-for="resource in resourceCardTypes"
      :key="resource"
      :resource="resource"
      :count="counts[resource]"
      :hideCount="!counts[resource]"
      :clickable="counts[resource] > 0"
      :collectable="counts[resource] > 0"
      @clicked="$emit('collect-resource', resource)"
    />
  </div>
</template>

<script>
  import { resourceCardTypes } from '@/specs/resources';
  import ResourceCard from '@/components/game/ResourceCard';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'AvailableLoot',
    components: {
      ResourceCard,
      BaseButton
    },
    props: {
      counts: {
        type: Object,
        default: function() {
          return {};
        }
      },
      collectAll: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      hasAnyLoot: function() {
        return Object.values(this.counts).some(val => !!val);
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

    .collect-all {
      width: 100px;
      height: 50px;
      margin-right: $spacer;
    }
  }
</style>
