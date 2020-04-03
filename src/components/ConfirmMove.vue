<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="400"
  >
   <Card :title="`Confirm: ${type}`" :onAction="() => $emit('yes')" :onCancel="() => $emit('no')">
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
  </Card>
  </v-dialog>
</template>

<script>
  import Card from '@/components/Card';
  import Icon from '@/components/Icon';
  import buildingCosts from '@/utils/buildingCosts';
  import { resourceCardTypes, resourceNameToIcon, resouceCardNameToIcon, resourceCardColors } from '@/utils/tileManifest';

  export default {
    name: 'ConfirmMove',
    components: {
      Card,
      Icon
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'settlement'
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
