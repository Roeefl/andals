<template>
  <span v-if="tile.type === TILE_WATER && !!tile.resource" class="harbor">
    <BaseIcon name="sail-boat" :color="resourceCardColors[tile.resource]" size="70px" class="harbor-icon" />
    <span class="harbor-value">
      <BaseIcon
        v-if="tile.resource"
        size="large"
        :name="resourceCardIcons[tile.resource]"
        :color="resourceCardColors[tile.resource]"
      />
      {{ harborManifest[tile.resource] }}
    </span>
  </span>
</template>

<script>
  import { harborManifest, TILE_WATER } from '@/utils/tileManifest';
  import { resourceCardIcons, resourceCardColors } from '@/specs/resources';

  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'HarborTile',
    components: {
      BaseIcon,
    },
    props: {
      tile: {
        type: Object,
        default: () => ({ type: null, resource: null, value: 0  })
      }
    },
    created() {
      this.harborManifest = harborManifest;
      this.TILE_WATER = TILE_WATER;
      this.resourceCardIcons = resourceCardIcons;
      this.resourceCardColors = resourceCardColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .harbor {
    position: absolute;
    transform: rotate(90deg);
    top: $tile-size * 0.3;
    right: $tile-size * -0.3;
    z-index: $zindex-tile-value + 1;
    //  width: $tile-value-size * 0.75;
    // height: $tile-value-size * 0.75;
    // border-radius: 999px;

    .harbor-value {
      position: absolute;
      top: $tile-size * 1.1;
      right: $tile-size * 0.25;
      font-size: $font-size-sm;
      color: white;
      width: $tile-value-size;
      height: $tile-value-size;
    }
  }
</style>
