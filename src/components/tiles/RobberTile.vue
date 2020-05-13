<template>
  <span class="robber-tile">
    <img
      :src="require('../../assets/pieces/robber.svg')"
      alt="Robber"
    />
  </span>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .robber-tile {
    transform: rotate(90deg);
    z-index: $zindex-robber;
    position: absolute;
    top: $tile-size * 0.8;
    right: $tile-size * 0.1;
    width: 60px;
    height: 60px;
  }
</style>
