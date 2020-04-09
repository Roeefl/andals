<template>
  <drop @drop="$emit('dropped')" class="tile" :class="[type, tile.resource]">
    <Icon
      v-if="tile.resource && tile.value"
      :name="resourceCardNameToIcon[tile.resource]"
      size="50px"
      color="black"
      class="resource-icon"
    />
    <span class="inner value" v-if="tile.value">
      {{ tile.value }}
    </span>
    <span class="inner harbor" v-if="tile.type === TILE_WATER && !!tile.resource" :class="tile.resource">
      {{ harborTypes[tile.resource] }}
      <Icon
        v-if="tile.resource && tile.resource !== HARBOR_GENERIC"
        :name="resourceCardNameToIcon[tile.resource]"
        color="white"
        size="large"
      />
    </span>
    <slot />
  </drop>
</template>

<script>
  import {
    harborManifest,
    TILE_WATER,
    TILE_SPACER,
    HARBOR_GENERIC,
    resourceCardNameToIcon,
    resourceCardColors 
  } from '@/utils/tileManifest';
  
  import Icon from '@/components/common/Icon';

  export default {
    name: 'HexTile',
    components: {
      Icon,
    },
    props: {
      type: {
        type: String,
        required: true
      },
      tile: {
        type: Object,
        default: function() {
          return {
            type: TILE_WATER,
            resource: null,
            value: 0
          };
        }
      }
    },
    created() {
      this.harborTypes = harborManifest;
      this.TILE_WATER = TILE_WATER;
      this.HARBOR_GENERIC = HARBOR_GENERIC;
      this.resourceCardColors = resourceCardColors;
      this.resourceCardNameToIcon = resourceCardNameToIcon;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  // Basic selectors to make every tile into a Hexagon
  .tile {
    position: relative;
    margin: 25px auto;
    width: $tile-size; 
    height: $tile-size * 1.7;
    border-radius: 5px;
    background: #ccc;
    transform: rotate(-90deg);
    display: inline-block;
    margin-right: 60px;
    transition: all 150ms ease-in-out;

    &:before,
    &:after {
      position: absolute;
      content: '';
      width: inherit; height: inherit;
      border-radius: inherit;
      background: inherit;
    }

    &:before {
      transform: rotate(60deg);
    }

    &:after {
      transform: rotate(-60deg);
    }

    &.spacer {
      opacity: 0;
      opacity: 0.4;
    }

    &.water {
      background: $tile-water;
    }

    &.resource {
      &.brick   {   background: $tile-brick;    }
      &.lumber  {   background: $tile-lumber;   }
      &.desert  {   background: $tile-desert;   }
      &.ore     {   background: $tile-ore;      }
      &.wheat   {   background: $tile-wheat;    }
      &.sheep   {   background: $tile-sheep;    }
    }

    .resource-icon {
      transform: rotate(90deg);
      position: absolute;
      top: $tile-size * 0.45;
      left: $tile-size / 3;
      z-index: $zindex-tile-value + 1;
    }

    .inner {
      transform: rotate(90deg);
      width: $tile-value-size * 0.75;
      height: $tile-value-size * 0.75;
      position: absolute;
      top: $tile-size * 0.55;
      right: $tile-size * 0.75;
      border-radius: 999px;
      z-index: $zindex-tile-value;
      display: flex;
      justify-content: center;
      align-items: center;

      &.value {
        font-size: $font-size-md;
        border: 2px solid black;
        background: white;
      }

      &.harbor {
        font-size: $font-size-sm;

        &.harborGeneric { background: white; }
        &.brick   {   background: $tile-brick;    }
        &.lumber  {   background: $tile-lumber;   }
        &.ore     {   background: $tile-ore;      }
        &.wheat   {   background: $tile-wheat;    }
        &.sheep   {   background: $tile-sheep;    }
      }
    }
  }
</style>
