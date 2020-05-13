<template>
  <div class="mountain" :style="mountainStyle">
    <div class="mountain-top">
      <div v-for="(cap, c) in Array(3).fill(0)" :key="c" class="mountain-cap" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Mountain',
    props: {
      opacity: {
        type: Number,
        default: 1
      },
      size: {
        type: Number,
        default: 60
      }
    },
    computed: {
      mountainStyle: function() { 
        return {
          '--mountain-size': `${this.size}px`,
          opacity: this.opacity
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $mountain-base: #5b5157;
  $mountain-top: #aaa4a8;

  .mountain {
    border-left: var(--mountain-size) solid transparent;
    border-right: var(--mountain-size) solid transparent;
    border-bottom: calc(var(--mountain-size) * 1.2) solid $mountain-base;

    .mountain-top {
      position: absolute;
      right: calc(var(--mountain-size) * -0.43);
      border-left: calc(var(--mountain-size) * 0.43) solid transparent;
      border-right: calc(var(--mountain-size) * 0.43) solid transparent;
      border-bottom: calc(var(--mountain-size) * 0.51) solid $mountain-top;

      .mountain-cap {
        position: absolute;
        top: calc(var(--mountain-size) * 0.46);
        border-left: calc(var(--mountain-size) * 0.166) solid transparent;
        border-right: calc(var(--mountain-size) * 0.166) solid transparent;
        border-top: calc(var(--mountain-size) * 0.166) solid $mountain-top;

        &:nth-child(1) {
          left: calc(var(--mountain-size) * -0.36);
        }

        &:nth-child(2) {
          left: calc(var(--mountain-size) * -0.166);
        }

        &:nth-child(3) {
          left: calc(var(--mountain-size) * 0.03);
        }
      }
    }
  }
</style>