<script>
  import GamePiece from '@/components/game/GamePiece';
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  
  import { resourceCardColors } from '@/specs/resources';
  import { structureIcons } from '@/specs/gamePieces';
  import { hexToRgb } from '@/utils/colors';

  export default {
    name: 'StructureTile',
    components: {
      GamePiece,
      BaseButton,
      BaseIcon
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
        default: () => {}
      },
      harbor: {
        type: Object,
        default: () => null
      }
    },
    computed: {
      structureStyle: function() {
        return {};
        
        const hexBackground = (this.harbor && this.harbor.resource)
          ? resourceCardColors[this.harbor.resource]
          : this.myColor;

        const rgbBackground = hexToRgb(hexBackground);

        if (!!this.activeData.type || !this.enabled) return {};
        
        return {
          border: '1px solid black',
          backgroundColor: `rgba(${rgbBackground}, 0.5)`
        };
      }
    },
    created() {
      this.structureIcons = structureIcons;
    }
  }
</script>

<template>
  <v-hover v-slot:default="{ hover }" class="structure-tile" :class="[placement, { 'enabled': enabled }]">
    <span>
      <BaseButton
        icon
        width="40px"
        height="40px"
        class="structure-button"
        :class="[activeData.type, { 'disabled': !enabled }]"
        :style="structureStyle"
      >
        <BaseIcon v-if="!!activeData.type" size="54px" :color="activeData.color" :name="structureIcons[activeData.type]" />
        <slot />
      </BaseButton>
      <span v-if="hover && enabled" class="game-piece">
        <GamePiece
          :type="activeData.type ? 'city' : 'settlement'"
          :showCount="false"
          :color="myColor"
          @clicked="enabled && $emit('clicked')"
          size="60px"
        />
      </span>
    </span>
  </v-hover>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .structure-tile {
    transform: rotate(90deg);
    position: absolute;
    z-index: $zindex-tile-value + 3;

    &.top {
      top: $tile-size * 0.51;
      left: $tile-size * 1.37;
    }
    
    &.top-left {
      bottom: $tile-size * 1.53;
      left: $tile-size * 0.82;
    }

    &.enabled {
      .structure-button {
        border-radius: 999px;

        &.settlement {
          animation: heartbeat 2s ease-in-out infinite;
        }
      }
    }
  }

  .structure-button {
    &.settlement {
      // border-radius: 100px;
      background: $secondary;
    }

    &.city {
      background: #F4FF81;
    }

    &.disabled {
      cursor: initial;

      .icon {
        opacity: 0.2;
      }
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
