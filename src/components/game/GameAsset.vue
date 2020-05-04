<template>
  <span class="game-asset" :style="{ color }">
    <img
      :src="require(`../../assets/${type}/${asset}.svg`)"
      :alt="asset"
      :style="{ width, height }"
    />
  </span>
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
      width: {
        type: String,
        default: '240px'
      },
      height: {
        type: String,
        default: '240px'
      },
      color: {
        type: String,
        default: 'black'
      }
    }
  }
</script>
