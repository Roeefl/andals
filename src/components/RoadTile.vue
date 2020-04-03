<template>
  <Button icon :disabled="!enabled" :onClick="() => $emit('clicked')" class="road" :class="placement" :style="{ background: activeData.color }">
  </Button>
</template>

<script>
  import Button from '@/components/Button';

  export default {
    name: 'RoadTile',
    components: {
      Button
    },
    props: {
      placement: {
        type: String,
        required: true
      },
      enabled: {
        type: Boolean,
        default: true
      },
      activeData: {
        type: Object,
        default: function() {
          return {};
        }
      }
    } 
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .road {
    z-index: 20;
    position: absolute;
    border-radius: 3px;
    height: $tile-size;
    width: 8px;
    background: $ground;

    &.target {
      background-color: transparent;
      position: absolute;
      border: 2px dashed black;

      &:hover {
        background-color: yellow;
      }
    }

    &.left {
      transform: rotate(90deg);
      right: $tile-size * 0.45;
      bottom: $tile-size * 1.32;
    }

    &.top-left {
      transform: rotate(150deg);
      left: $tile-size * 1.3;
      top: $tile-size * -0.15;
    }

    &.top-right {
      transform: rotate(30deg);
      left: $tile-size * 1.3;
      top: $tile-size * 0.8;
    }

    &.right {
      transform: rotate(90deg);
      left: $tile-size * 0.45;
      top: $tile-size * 1.32;
    }

    &.bottom-right {
      transform: rotate(90deg);
      left: $tile-size * 0.45;
      top: $tile-size * 1.32;
    }

    &.bottom-left {
      transform: rotate(90deg);
      right: $tile-size * 0.45;
      bottom: $tile-size * 1.32;
    }
  }
</style>