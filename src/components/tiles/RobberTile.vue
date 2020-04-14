<template>
  <BaseButton
    icon
    :xl="active"
    iconName="guy-fawkes-mask"
    :iconColor="active ? 'black' : 'deep-orange darken-4'"
    :iconSize="active ? '64px' : '32px'"
    class="robber"
    :class="{ 'moveable': active }"
  />
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'RobberTile',
    components: {
      BaseButton
    },
    props: {
      active: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .robber {
    transform: rotate(90deg);
    position: absolute;
    top: $tile-size * 1.1;
    right: $tile-size * 0.35;
    z-index: $zindex-robber;
    cursor: default;

    &.moveable {
      cursor: -webkit-drag;
    }
  }
</style>
