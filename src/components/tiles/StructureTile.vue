<template>
  <span class="structure" :class="[placement, { 'enabled': enabled }]" :style="hoverStyle">
    <BaseButton
      icon
      @click="enabled && $emit('clicked')"
      class="wrapper"
      :class="[activeData.type, { 'disabled': !enabled }]"
      :style="structureStyle"
    >
      <BaseIcon v-if="!activeData.ownerId" size="24px" color="white" name="circle-outline" class="icon" />
      <BaseIcon v-if="!!activeData.type" size="40px" :color="activeData.color" :name="iconNames[activeData.type]" />
      <slot />
    </BaseButton>
  </span>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  import { resourceCardColors } from '@/specs/resources';
  import { hexToRgb } from '@/utils/colors';

  const iconNames = {
    settlement: 'home',
    city: 'city'
  };

  const DEFAULT_HEX_BG = '#6D4C41';

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
        const hexBackground = (this.harbor && this.harbor.resource) ?
          resourceCardColors[this.harbor.resource]
          : DEFAULT_HEX_BG;

        const rgbBackground = hexToRgb(hexBackground);

        return {
          backgroundColor: `rgba(${rgbBackground}, 0.7)`
        };
      }
    },
    created() {
      this.iconNames = iconNames;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .structure {
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
      border-radius: 999px;
      box-shadow: 1px 1px 4px 4px #E1F5FE;

      &:hover {
        box-shadow: 2px 2px 12px 12px var(--color-hover);
      }
    }
  }

  .wrapper {
    background: #6D4C41;
      
    &.settlement {
      background: white;
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
