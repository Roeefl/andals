<template>
  <div class="wrapper">
    <section class="beyond-the-wall">
    </section>
    <section class="westeros-north">
      <Mountain v-for="(mountain, m) in Array(6).fill(0)" :key="m" class="mountain" />
    </section>
    <section class="westeros-middle">
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

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .beyond-the-wall {
      flex: 2;
      background: white;
      position: relative;
    }

    .westeros-north {
      flex: 4;
      background: $primary;
      position: relative;
    }

    .westeros-middle {
      flex: 1;
      background: green;
      position: relative;
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