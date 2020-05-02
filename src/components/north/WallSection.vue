<template>
  <ul class="wall-tile" :style="hoverStyle">
    <li v-for="position in positions" :key="position" class="wall-position" :class="{ 'enabled': allowPurchase && isBuildGuardAllowed(position) }">
      <drop @drop="$emit('relocate-guard', $event)">
        <WallSectionPosition :position="position" :guard="guards.find(guard => guard.position === position)" @clicked="onPositionClicked(position)" />
      </drop>
    </li>
  </ul>
</template>

<script>
// -${guard.ownerId}

  import WallSectionPosition from '@/components/north/WallSectionPosition';
  import { wallSectionSize } from '@/specs/wall';

  const positions = new Array(wallSectionSize).fill(0).map((x, positionIndex) => positionIndex);

  export default {
    name: 'WallSection',
    components: {
      WallSectionPosition
    },
    props: {
      guards: {
        type: Array,
        default: () => []
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
    created() {
      this.positions = positions;
    },
    methods: {
      isBuildGuardAllowed: function(position) {
        const guardAtPosition = this.guards.find(guard => guard.position === position);
        if (guardAtPosition) return false;

        return positions
          .filter(p => p < position)
          .every(p => !!(this.guards.find(guard => guard.position === p)));
      },
      hasOpponentGuard: function(position) {
        return !!(this.guards.find(guard => guard.position === position));
      },
      onPositionClicked: function(position) {
        if (this.isBuildGuardAllowed(position)) {
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
