<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="400"
  >
   <ActionCard :title="`Confirm: ${type}`" @cancel="$emit('no')" @approve="$emit('yes')">
    Build {{ type }} for:
    <div class="cost">
      <span v-for="resource in resourceCardTypes" :key="resource">
        <Icon
          v-for="(icon, i) in Array(buildingCosts[type][resource] || 0).fill(resource)"
          :key="i"
          size="x-large"
          :name="resouceCardNameToIcon[resource]"
          :color="resourceCardColors[resource]"
        />
      </span>
    </div>
  </ActionCard>
  </v-dialog>
</template>

<script>
  import buildingCosts from '@/utils/buildingCosts';
  import { resourceCardTypes, resourceNameToIcon, resouceCardNameToIcon, resourceCardColors } from '@/utils/tileManifest';
  import ActionCard from '@/components/ActionCard';
  import Icon from '@/components/Icon';

  export default {
    name: 'ConfirmMove',
    components: {
      ActionCard,
      Icon
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
      this.resouceCardNameToIcon = resouceCardNameToIcon;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .confirm {
    height: 200px;
  }
</style>
