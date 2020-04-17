<template>
  <div class="snowflakes">
    <span class="snowflake" v-for="(s, i) in Array(count)" :key="`snowflake-${i}`" />
  </div>
</template>

<script>
  export default {
    name: 'Snowflakes',
    props: {
      count: {
        type: Number,
        default: 100
      }
    }
  }
</script>

<style scoped lang="scss">
  $count: 100; //@TODO: Unify this and count prop

  $snowflake-size: 7px;
  $snowflake-color: white;
  
  @keyframes snowflakes-fall {
    0% {
      top: 0;
    }
    100% {
      top: 105%;
    }
  }

  @keyframes snowflakes-shake {
    0% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(80px);
    }
    100% {
      transform: translateX(0px);
    }
  }

  @mixin all-snowflakes() {
    @for $s from 0 to $count {
      $left: random(100) / 100;
      $size: #{random(14)}px;
      $opacity: random(10) / 10;

      &:nth-child(#{$s + 1}) {
        left: percentage($left);
        animation-delay: #{random(20)}s, #{random(10)}s;
        width: $size;
        height: $size;
        background: rgba($snowflake-color, $opacity);
      }
    }
  }

  .snowflakes {
    width: 100%;
    height: 100%;
    overflow-y: hidden;

    .snowflake {
      position: absolute;
      top: -1000px;
      z-index: 9999;
      width: $snowflake-size;
      height: $snowflake-size;
      border-radius: 100%;
      background: $snowflake-color;
      // snowflakes-shake @FIXME: removed this animation
      animation-name: snowflakes-fall;
      animation-duration: 7s, 3s;
      animation-timing-function: linear, ease-in-out;
      animation-iteration-count: infinite, infinite;
      animation-play-state: running, running;

      @include all-snowflakes();
    }
  }
</style>