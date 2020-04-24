<template>
  <span class="structure-tile" :class="[placement, { 'enabled': enabled }]" :style="hoverStyle">
    <BaseButton
      icon
      width="40px"
      height="40px"
      @click="enabled && $emit('clicked')"
      class="structure-button"
      :class="[activeData.type, { 'disabled': !enabled }]"
      :style="structureStyle"
    >
      <BaseIcon v-if="!activeData.ownerId" size="24px" color="white" name="circle-outline" class="icon" />
      <BaseIcon v-if="!!activeData.type" size="54px" :color="activeData.color" :name="structureIcons[activeData.type]" />
      <slot />
    </BaseButton>
  </span>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  
  import { resourceCardColors } from '@/specs/resources';
  import { structureIcons } from '@/specs/gamePieces';
  import { hexToRgb } from '@/utils/colors';

  export default {
    name: 'StructureTile',
    components: {
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
      hoverStyle: function() {
        return {
          '--color-hover': this.myColor
        }
      },
      structureStyle: function() {
        const hexBackground = (this.harbor && this.harbor.resource)
          ? resourceCardColors[this.harbor.resource]
          : this.myColor;

        const rgbBackground = hexToRgb(hexBackground);

        if (!!this.activeData.type || !this.enabled) return {};
        
        return {
          border: '1px dashed black',
          backgroundColor: `rgba(${rgbBackground}, 0.5)`
        };
      }
    },
    created() {
      this.structureIcons = structureIcons;
    }
  }
</script>

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
        animation: heartbeat 2s cubic-bezier(0.860, 0.000, 0.070, 1.000) infinite both;
        border-radius: 999px;

        &:hover {
          background: rgba(black, 1);
          box-shadow: 2px 2px 12px 12px var(--color-hover);
        }
      }
    }
  }

  .structure-button {
    &.settlement {
      // border-radius: 100px;
      background: black;
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
</style>
