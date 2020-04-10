<template>
  <drop @drop="$emit('dropped')" class="tile" :class="[type, tile.resource]">
    <BaseIcon
      v-if="tile.resource && tile.value"
      :name="resourceCardIcons[tile.resource]"
      size="50px"
      color="black"
      class="resource-icon"
    />
    <span class="inner value" v-if="tile.value">
      {{ tile.value }}
    </span>
    <span class="inner harbor" v-if="tile.type === TILE_WATER && !!tile.resource" :class="tile.resource">
      {{ harborManifest[tile.resource] }}
      <BaseIcon
        v-if="tile.resource && tile.resource !== HARBOR_GENERIC"
        :name="resourceCardIcons[tile.resource]"
        color="white"
        size="large"
      />
    </span>
    <BaseIcon v-if="tile.type === TILE_WATER && !!tile.resource" name="sail-boat" color="#3E2723" size="50px" class="harbor-icon" />
    <slot />
  </drop>
</template>

<script>
  import {
    harborManifest,
    TILE_WATER,
    TILE_SPACER,
    HARBOR_GENERIC
  } from '@/utils/tileManifest';
  import { resourceCardIcons } from '@/specs/resources';
  
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'HexTile',
    components: {
      BaseIcon,
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
      this.harborManifest = harborManifest;
      this.TILE_WATER = TILE_WATER;
      this.HARBOR_GENERIC = HARBOR_GENERIC;
      this.resourceCardIcons = resourceCardIcons;
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
    transform: rotate(-90deg);
    display: inline-block;
    margin-right: 60px;
    transition: all 150ms ease-in-out;
    z-index: $zindex-tile-value;

    &:before,
    &:after {
      position: absolute;
      content: '';
      width: inherit;
      height: inherit;
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
    }

    &.water {
      // background: rgba($tile-water, 0.5);
      background: transparent;
      border-top: 1px solid black;
      border-bottom: 1px solid black;

      &:before, &:after {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
      }
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
      z-index: $zindex-tile-value + 2;
    }

    .inner {
      transform: rotate(90deg);
      width: $tile-value-size * 0.75;
      height: $tile-value-size * 0.75;
      position: absolute;
      top: $tile-size * 0.55;
      right: $tile-size * 0.75;
      border-radius: 999px;
      z-index: $zindex-tile-value + 1;
      display: flex;
      justify-content: center;
      align-items: center;

      &.value {
        font-size: $font-size-md;
        border: 2px solid black;
        background: white;
        color: black;
        cursor: default;
      }

      &.harbor {
        font-size: $font-size-sm;
        color: white;
        width: $tile-value-size;
        height: $tile-value-size;
        top: $tile-size * 0.5;
        right: $tile-size * 0.45;

        &.harborGeneric   {   background: white; color: black;       }
        &.brick           {   background: $tile-brick;  }
        &.lumber          {   background: $tile-lumber; }
        &.ore             {   background: $tile-ore;    }
        &.wheat           {   background: $tile-wheat;  }
        &.sheep           {   background: $tile-sheep;  }
      }
    }

    .harbor-icon {
      transform: rotate(90deg);
      position: absolute;
      top: $tile-size * 0.45;
      right: $tile-size * -0.3;
    }
  }
</style>
