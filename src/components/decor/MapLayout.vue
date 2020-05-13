<template>
  <div class="wrapper">
    <section class="beyond-the-wall">
    </section>
    <section class="westeros-north">
      <Mountain v-for="(mountain, m) in Array(6).fill(0)" :key="m" class="mountain" />
    </section>
  </div>
</template>

<script>
  import Mountain from '@/components/decor/Mountain';

  export default {
    name: 'MapLayout',
    components: {
      Mountain
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $total-mountains: 6;
  $mountain-width: 60px;
  $mountain-margin: 140px;

  $board-height: 64vh;

  .wrapper {
    width: 100%;
    height: 100%;

    .beyond-the-wall {
      background: white;
      position: relative;
      height: $board-height / 2;
    }

    .westeros-north {
      background: $primary;
      position: relative;
      height: $board-height;
    }
  }

  @mixin mountain-positions() {
    @for $m from 0 to $total-mountains {
      &:nth-child(#{$m + 1}) {
        left: calc(#{($mountain-width + $mountain-margin) * $m});
      }
    }
  }

  .mountain {
    position: absolute;
    bottom: 0;
    @include mountain-positions();
  }
</style>