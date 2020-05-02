<template>
  <img
    :src="require('../../assets/pieces/robber.svg')"
    alt="Robber"
    class="robber-tile"
  />
</template>

<script>
  export default {
    name: 'RobberTile',
    props: {
      active: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .robber-tile {
    transform: rotate(90deg);
    z-index: $zindex-robber;
    position: absolute;
    top: $tile-size * 1.1;
    right: $tile-size * 0.35;
  }
</style>
