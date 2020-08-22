<script>
  import GamePiece from '@/components/game/GamePiece';

  export default {
    name: 'RoadTile',
    components: {
      GamePiece
    },
    props: {
      placement: {
        type: String,
        required: true
      },
      enabled: {
        type: Boolean,
        default: true
      },
      myColor: {
        type: String,
        default: 'white'
      },
      activeData: {
        type: Object,
        default: function() {
          return {};
        }
      },
      removeable: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      roadStyle: function() {
        return {
          background: this.activeData.color,
          border: this.activeData.color ? '4px inset black' : ''
        }
      }
    },
    methods: {
      onClick: function() {
        if (this.removeable) {
          this.$emit('remove');
        }
        else {
          if (this.enabled)
            this.$emit('clicked');
        }
      }
    }
  }
</script>

<template>
  <v-hover v-slot:default="{ hover }" class="road" :class="[placement, { 'enabled': enabled }]" :style="roadStyle">
    <span>
      <slot />
      <span v-if="hover && enabled" class="game-piece">
        <GamePiece
          type="road"
          :showCount="false"
          :color="myColor"
          @clicked="onClick"
          size="60px"
        />
      </span>
    </span>
  </v-hover>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .road {
    z-index: $zindex-tile-value - 1;
    position: absolute;
    border-radius: 3px;
    height: $tile-size;
    width: 18px;

    &.enabled {
      // background: transparent;
      // box-shadow: 4px 4px 12px 12px #E1F5FE;
    }

    &.left {
      transform: rotate(90deg);
      right: $tile-size * 0.45;
      bottom: $tile-size * 1.35;
    }

    &.top-left {
      transform: rotate(150deg);
      left: $tile-size * 1.3;
      top: $tile-size * -0.05;
    }

    &.top-right {
      transform: rotate(30deg);
      left: $tile-size * 1.3;
      top: $tile-size * 0.8;
    }

    &.right {
      transform: rotate(90deg);
      left: $tile-size * 0.45;
      top: $tile-size * 1.32;
    }

    &.bottom-right {
      transform: rotate(90deg);
      left: $tile-size * 0.45;
      top: $tile-size * 1.32;
    }

    &.bottom-left {
      transform: rotate(90deg);
      right: $tile-size * 0.45;
      bottom: $tile-size * 1.32;
    }
  }

  .game-piece {
    position: absolute;
    top: 0;
    left: 0;
    border: 2px solid $highlight;
    padding: $spacer;
    border-radius: 100%;
    animation: heartbeat 2s ease-in-out;
  }
</style>