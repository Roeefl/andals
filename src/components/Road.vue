<template>
  <span class="road" :class="placement" />
</template>

<script>
  export default {
    name: 'Road',
    props: {
      placement: {
        type: String,
        default: 'left'
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
    background-color: $ground;
    height: $tile-size;
    width: 8px;

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