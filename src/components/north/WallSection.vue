<template>
  <ul class="wall-tile" :style="hoverStyle">
    <li v-for="(guard, p) in guards" :key="`position-${p}-${(guard || {}).ownerId}`" class="wall-position" :class="{ 'enabled': allowPurchase && isGuardAllowed(p) }">
      <WallSectionPosition :order="p + 1" :guard="guard" @clicked="onPositionClicked(p)" />
    </li>
  </ul>
</template>

<script>
  import WallSectionPosition from '@/components/north/WallSectionPosition';

  export default {
    name: 'WallTile',
    components: {
      WallSectionPosition
    },
    props: {
      guards: {
        type: Array,
        default: () => new Array(5).fill(null)
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
    computed: {
      hoverStyle: function() { 
        return {
          '--color-hover': this.myColor
        }
      }
    },
    methods: {
      isGuardAllowed: function(position) {
        if (!!this.guards[position].ownerId) return false;

        return this.guards
          .filter((pos, p) => p < position)
          .every(guard => !!guard && !!guard.ownerId);
      },
      hasOpponentGuard: function(position) {
        return !!this.guards[position].ownerId;
      },
      onPositionClicked: function(position) {
        if (this.isGuardAllowed(position)) {
          this.$emit('wall-clicked', position);
          return;
        }

        if (this.allowRemove && this.hasOpponentGuard(position))
          this.$emit('kill-guard', position);
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

    &.enabled {
      &:hover {
        box-shadow: 2px 2px 12px 12px var(--color-hover);
      }
    }

    & + & {
      border-left: 1px solid $mountain;
    }
  }
</style>
