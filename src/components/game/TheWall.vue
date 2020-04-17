<template>
  <div class="the-wall">
    <WallTile v-for="(wall, w) in wallTiles" :key="`wall-${w}`" :myColor="myColor" />
  </div>
</template>

<script>
  import WallTile from '@/components/tiles/WallTile';

  const wallTiles = [0, 1, 2, 3];

  export default {
    name: 'TheWall',
    components: {
      WallTile
    },
    props: {
      myColor: {
        type: String,
        default: 'red'
      }
    },
    created() {
      this.wallTiles = wallTiles;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .the-wall {
    border: 1px dashed black;
    display: flex;
  }
</style>
