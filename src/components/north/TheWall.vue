<template>
  <div class="the-wall">
    <WallTile
      v-for="(sectionStart, w) in wallTiles"
      :key="`wall-${w}`"
      :section="w"
      :myColor="myColor"
      :allowPurchase="allowPurchase"
      :allowRemove="allowRemove"
      :guards="wall.slice(sectionStart, sectionStart + 5)"
      @wall-clicked="$emit('wall-clicked', { section: w, position: $event })"
    />
  </div>
</template>

<script>
  import WallTile from '@/components/north/WallTile';

  const wallTiles = [0, 5, 10, 15];

  export default {
    name: 'TheWall',
    components: {
      WallTile
    },
    props: {
      wall: {
        type: Array,
        default: () => Array(20).fill({})
      },
      myColor: {
        type: String,
        default: 'red'
      },
      allowPurchase: {
        type: Boolean,
        default: false
      },
      allowRemove: {
        type: Boolean,
        default: false   
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
    display: grid;
    grid-template-columns: repeat(4, 25%);
  }
</style>
