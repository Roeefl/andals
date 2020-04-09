<template>
  <Button
    icon
    :xl="active"
    iconName="guy-fawkes-mask"
    :iconColor="active ? 'black' : 'deep-orange darken-4'"
    :iconSize="active ? '64px' : '32px'"
    class="robber"
  />
</template>

<script>
  import Button from '@/components/common/Button';

  export default {
    name: 'Robber',
    components: {
      Button
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
    z-index: 20;
    cursor: -webkit-drag;
  }
</style>
