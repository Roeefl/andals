<template>
  <ul class="wall-tile" :style="hoverStyle">
    <li v-for="(pos, p) in positions" :key="p" class="wall-position">
      <WallPosition :order="p + 1" />
    </li>
  </ul>
</template>

<script>
  import WallPosition from '@/components/north/WallPosition';

  const positions = [0, 1, 2, 3, 4];

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
    },
    created() {
      this.positions = positions;
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
  }

  .wall-position {
    width: 20%;
    display: flex;
    align-items: center;

    &:hover {
      box-shadow: 2px 2px 12px 12px var(--color-hover);
    }

    & + & {
      border-left: 1px solid $mountain;
    }
  }
</style>
