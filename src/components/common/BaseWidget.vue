<template>
  <div class="widget">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'BaseWidget'
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .widget {
    background: rgba($secondary, 0.85);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
