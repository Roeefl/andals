<template>
  <div class="house" :style="settlementStyle">
    <div class="inner">
      <div class="door" />
    </div>
    <div class="chimney" />
  </div>
</template>

<script>
  export default {
    name: 'Settlement',
    props: {
      size: {
        type: Number,
        default: 102
      }
    },
    computed: {
      settlementStyle: function() {
        return {
          width: `${this.size}px`,
          height: `${this.size * 0.8}px`
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .house {
    position: absolute;
    z-index: 4;

    &::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 65px solid transparent;
      border-right: 65px solid transparent;
      border-bottom: 60px solid white;
      top: -50px; left: -12px;
    }
    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 53px solid transparent;
      border-right: 53px solid transparent;
      border-bottom: 50px solid #dd33b0;
      top: -39px; left: 0px;
    }
  }

  .inner {
    position: absolute;
    width: 21px;
    height: 30px;
    border-radius: 30px 30px 0 0;
    background: #333;
    border: 2px solid #eaeaea;
    top: 3px; left: 12px;
    z-index: 10;

    &::before {
      content: '';
      position: absolute;
      width: 21px;
      height: 30px;
      border-radius: 30px 30px 0 0;
      border: 2px solid #eaeaea;
      top: -1px; left: 30px;
      background: #edca4e;
    }

    &::after {
      content: '';
      position: absolute;
      width: 21px;
      height: 30px;
      border-radius: 30px 30px 0 0;
      background: #333;
      border: 2px solid #eaeaea;
      top: 0px; left: 60px;
    }

    .door {
      position: absolute;
      width: 30px;
      height: 40px;
      border-radius: 30px 30px 0 0;
      background: #333;
      border: 2px solid #eaeaea;
      top: 35px; left: -6px;

      &::before {
        content: '';
        position: absolute;
        width: 21px;
        height: 30px;
        border-radius: 30px 30px 0 0;
        background: #333;
        border: 2px solid #eaeaea;
        top: 0px; left: 35px;
      }

      &::after {
        content: '';
        position: absolute;
        width: 21px;
        height: 30px;
        border-radius: 30px 30px 0 0;
        border: 2px solid #eaeaea;
        top: 0px; left: 65px;
        background: #edca4e;
      }
    }
  }

  .chimney {
    position: absolute;
    width: 9px;
    height: 21px;
    background: gray;
    border-top: 3px solid white;
    top: -35px;
    right: 5px;
    z-index: 3;
  }
</style>