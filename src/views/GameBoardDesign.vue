<template>
  <div class="design-board">
    <div class="header-fallback" />
    <div class="layout-container">
      <MapLayout />
    </div>
  </div>
</template>

<script>
  import MapLayout from '@/components/decor/MapLayout';

  export default {
    name: 'GameBoardDesign',
    components: {
      MapLayout
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .design-board {
    .header-fallback {
      height: $header-height;
      background: $info;
    }
  
    .layout-container {
      width: 100vw;
      height: calc(100vh - #{$header-height});
    }
  }
</style>