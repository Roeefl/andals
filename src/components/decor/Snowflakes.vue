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
        default: 30
      }
    }
  }
</script>

<style scoped lang="scss">
  $count: 30; //@TODO: Unify this and count prop

  $snowflake-size: 7px;
  $snowflake-color: white;
  
  @keyframes snowflakes-fall {
    0% {
      top: 1%;
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
      &:nth-child(#{$s + 1}) {
        left: percentage(random(100) / 100);
        animation-delay: #{random(8)}s, #{random(1)}s;
      }
    }
  }

  @mixin some-snowflakes($first, $last, $size, $opacity) {
    @for $s from $first through $last {
      &:nth-child(#{$s}) {
        width: $size;
        height: $size;
        background: rgba(255, 255, 255, $opacity);
      }
    }
  }

  .snowflakes {
    width: 100%;
    height: 100%;

    .snowflake {
      width: $snowflake-size;
      height: $snowflake-size;
      border-radius: 100%;
      background: $snowflake-color;
      position: absolute;
      top: -3%;
      z-index: 9999;
      animation-name: snowflakes-fall, snowflakes-shake;
      animation-duration: 7s, 3s;
      animation-timing-function: linear, ease-in-out;
      animation-iteration-count: infinite, infinite;
      animation-play-state: running, running;
      
      @include all-snowflakes();
      @include some-snowflakes(10, 14, 12px, 0.5);
      @include some-snowflakes(15, 21, 3px, 0.7);
    }
  }
</style>