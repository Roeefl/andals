<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="400"
  >
   <ActionCard :title="`Confirm: ${type}`" @cancel="$emit('no')" @approve="$emit('yes')">
    Build {{ type }} for:
    <div class="cost">
      <ResourceCard
        v-for="resource in resourceCardTypes"
        :key="resource"
        :resource="resource"
        :count="buildingCosts[type][resource]"
        v-show="buildingCosts[type][resource]"
        class="resource-card"
      />
    </div>
  </ActionCard>
  </v-dialog>
</template>

<script>
  import buildingCosts from '@/utils/buildingCosts';
  import { resourceCardTypes, resourceNameToIcon, resourceCardColors } from '@/utils/tileManifest';

  import ResourceCard from '@/components/ResourceCard';
  import ActionCard from '@/components/ActionCard';

  export default {
    name: 'ConfirmMove',
    components: {
      ResourceCard,
      ActionCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        required: true
      }
    },
    created() {
      this.buildingCosts = buildingCosts;
      this.resourceNameToIcon = resourceNameToIcon;
      this.resourceCardTypes = resourceCardTypes;
      this.resourceCardColors = resourceCardColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .cost {
    display: flex;
  }

  .resource-card {
    & + & {
      margin-left: $spacer * 2;
    }
  }
</style>
