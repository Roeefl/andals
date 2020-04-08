<template>
 <Button
    icon
    iconSize="50px"
    iconColor="black"
    iconName="guy-fawkes-mask"
    class="robber"
  />
</template>

<script>
  import Button from '@/components/common/Button';

  export default {
    name: 'Robber',
    components: {
      Button
    }
  };
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .robber {
    transform: rotate(90deg);
    position: absolute;
    top: $tile-size * 0.6;
    right: $tile-size * 0.25;
    z-index: 20;
  }
</style>
