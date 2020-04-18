<template>
  <ul class="wall-tile" :style="hoverStyle">
    <li v-for="(guard, p) in guards" :key="`position-${p}`" class="wall-position">
      <WallPosition :order="p + 1" :guard="guard" @clicked="$emit('wall-clicked', p)" />
    </li>
  </ul>
</template>

<script>
  import WallPosition from '@/components/north/WallPosition';

  export default {
    name: 'WallTile',
    components: {
      WallPosition
    },
    props: {
      guards: {
        type: Array,
        default: () => new Array(5).fill(null)
      },
      enabled: {
        type: Boolean,
        default: false
      },
      myColor: {
        type: String,
        default: 'red'
      }
    },
    computed: {
      hoverStyle: function() {
        if (!this.enabled) return {};
        
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
