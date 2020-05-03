<template>
  <img
    :src="require(`../../assets/${type}/${asset}.svg`)"
    :alt="asset"
    class="game-asset"
  />
</template>

<script>
  export default {
    name: 'GameAsset',
    props: {
      type: {
        type: String,
        default: 'pieces'
      },
      asset: {
        type: String,
        default: 'robber'
      },
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .game-asset {
    width: 240px;
    height: 240px;
  }
</style>
