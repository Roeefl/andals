<template>
  <div class="counts">
    <Button
      xs
      color="red accent-3"
      iconName="treasure-chest"
      iconColor="white"
      iconSize="x-large"
      :clickable="hasAnyLoot"
      @click="$emit('collect-all')"
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
      class="resource-card"
      @clicked="$emit('collect-all')"
    />
  </div>
</template>

<script>
  import { resourceCardTypes } from '@/specs/resources';
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

  .resource-card {
    & + & {
      margin-left: $spacer;
    }
  }
</style>
