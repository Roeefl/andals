<template>
  <Button
    icon
    :disabled="!enabled"
    @click="$emit('clicked')"
    class="road"
    :class="[placement, { 'enabled': enabled }]"
    :style="{ background: activeData.color, ...hoverStyle }"
  />
</template>

<script>
  import Button from '@/components/common/Button';

  export default {
    name: 'RoadTile',
    components: {
      Button
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

  .road {
    background: $tile-road;
    z-index: 20;
    position: absolute;
    border-radius: 3px;
    height: $tile-size;
    width: 8px;

    &.enabled {
      // background: transparent;
      box-shadow: 4px 4px 12px 8px rgba(211,68,219,1);
      
      &:hover {
        background: var(--color-hover);
      }
    }

    &.left {
      transform: rotate(90deg);
      right: $tile-size * 0.45;
      bottom: $tile-size * 1.32;
      // background: red;
    }

    &.top-left {
      transform: rotate(150deg);
      left: $tile-size * 1.3;
      top: $tile-size * -0.15;
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