<template>
  <div class="widget">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'DraggableWidget'
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .widget {
    background: rgba($primary, 0.5);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
