<template>
  <div class="tile" :class="[type, resourceData.resource]">
    <span class="inner value" v-if="resourceData.value">
      {{ resourceData.value }}
    </span>
    <span class="inner harbor" v-if="harborData.type" :class="harborData.type">
      {{ harborTypes[harborData.type] }}
      <Icon name="box" v-if="harborData.type !== TILE_WATER">
        <IconBox />
      </Icon>
    </span>
  </div>
</template>

<script>
  import {
    harborManifest,
    TILE_RESOURCE,
    TILE_WATER,
    TILE_SPACER
  } from '@/utils/tileManifest';
  import Icon from '@/components/Icon';
  import IconBox from '@/components/Icons/IconBox';

  export default {
    name: 'Tile',
    components: {
      Icon,
      IconBox
    },
    props: {
      type: String,
      resourceData: Object, // with resource and value,
      harborData: Object // with type
    },
    computed: {
      harborTypes: () => harborManifest,
      TILE_WATER: () => TILE_WATER
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
  }

  .inner {
    transform: rotate(90deg);

    width: $tile-value-size;
    height: $tile-value-size;

    position: absolute;
    top: $tile-size / 2;
    left: $tile-size / 4;

    border-radius: 999px;
    z-index: $zindex-tile-value;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .value {
    font-size: $font-size-lg;
    border: 2px solid black;
    background: white;
  }

  .harbor {
    font-size: $font-size-sm;

    &.harborGeneric { background: white; }
    &.brick   {   background: $tile-brick;    }
    &.lumber  {   background: $tile-lumber;   }
    &.ore     {   background: $tile-ore;      }
    &.wheat   {   background: $tile-wheat;    }
    &.sheep   {   background: $tile-sheep;    }
  }
</style>
