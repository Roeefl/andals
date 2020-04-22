<template>
  <BaseButton
    icon
    :disabled="!enabled"
    @click="$emit('clicked')"
    class="road"
    :class="[placement, { 'enabled': enabled }]"
    :style="roadStyle"
  >
    <slot />
  </BaseButton>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'RoadTile',
    components: {
      BaseButton
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
      }
    },
    computed: {
      roadStyle: function() {
        return {
          '--color-hover': this.myColor,
          background: this.activeData.color,
          border: this.activeData.color ? '4px inset black' : ''
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  @keyframes change-background {
    0% {
      background: white;
    }
    50% {
      background: var(--color-hover);
    }
    100% {
      background: transparent;
    }
  }

  .road {
    background: #6D4C41;
    z-index: $zindex-tile-value - 1;
    position: absolute;
    border-radius: 3px;
    height: $tile-size;
    width: 16px;
    border: 2px dashed black;

    &.enabled {
      // background: transparent;
      // box-shadow: 4px 4px 12px 12px #E1F5FE;
      animation: change-background 2.5s ease infinite;
      
      // &:hover {
      //   background: var(--color-hover);
      // }
    }

    &.left {
      transform: rotate(90deg);
      right: $tile-size * 0.45;
      bottom: $tile-size * 1.35;
      // background: red;
    }

    &.top-left {
      transform: rotate(150deg);
      left: $tile-size * 1.3;
      top: $tile-size * -0.05;
      // background: yellow;
    }

    &.top-right {
      transform: rotate(30deg);
      left: $tile-size * 1.3;
      top: $tile-size * 0.8;
      // background: blue;
    }

    &.right {
      transform: rotate(90deg);
      left: $tile-size * 0.45;
      top: $tile-size * 1.32;
      // background: green;
    }

    &.bottom-right {
      transform: rotate(90deg);
      left: $tile-size * 0.45;
      top: $tile-size * 1.32;
      // background: pink;
    }

    &.bottom-left {
      transform: rotate(90deg);
      right: $tile-size * 0.45;
      bottom: $tile-size * 1.32;
      // background: orange;
    }
  }
</style>