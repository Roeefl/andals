<template>
  <div class="tile" :class="[type, resourceData.resource]">
    <span class="value" v-if="resourceData.value">
      {{ resourceData.value }}
    </span>
  </div>
</template>

<script>
  import {
    TILE_RESOURCE,
    TILE_WATER,
    TILE_HARBOR,
    TILE_SPACER
  } from '@/utils/tileManifest';

  export default {
    name: 'Tile',
    props: {
      type: String,
      resourceData: Object // with resource and value
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
    }

    &.water {
      background: aqua;
    }

    &.resource {
      &.brick   {   background: $tile-brick;    }
      &.lumber  {   background: $tile-lumber;   }
      &.desert  {   background: $tile-desert;   }
      &.ore     {   background: $tile-ore;      }
      &.wheat   {   background: $tile-wheat;    }
      &.sheep   {   background: $tile-sheep;    }
    }
  }

  .value {
    transform: rotate(90deg);

    width: $tile-value-size;
    height: $tile-value-size;

    position: absolute;
    top: $tile-size / 2;
    left: $tile-size / 4;

    font-size: $font-size-xl;
    background: white;
    border-radius: 999px;
    border: 2px solid black;
    z-index: $zindex-tile-value;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
