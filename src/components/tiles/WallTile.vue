<template>
  <div class="wall-tile">
    <WallPosition v-for="(pos, p) in Array(5).fill(0)" :key="p" :order="p + 1" class="wall-position" />
  </div>
</template>

<script>
  import WallPosition from '@/components/tiles/WallPosition';
  import { hexToRgb } from '@/utils/colors';

  export default {
    name: 'WallTile',
    components: {
      WallPosition
    },
    props: {
      myColor: {
        type: String,
        default: 'red'
      }
    },
    computed: {
      hoverStyle: function() {
        return {
          '--color-hover': this.myColor
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wall-tile {
    background: $primary;
    box-shadow: 8px 8px 16px 16px $mountain;
    display: flex;
    width: 100%;

    .wall-position {
      width: 20%;
    }
  }
</style>
