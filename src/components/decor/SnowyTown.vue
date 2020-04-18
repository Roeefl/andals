<template>
  <div class="game-loader">
    <div class="mountains">
      <div class="mountains-top" />
      <div class="mountain-shadow" />
    </div>
    <div class="base" />
    <Settlement v-for="(house, h) in houses" :key="h" class="house" :class="`house-${h}`" />
    <ul class="trees trees-left">
      <li v-for="(tree, t) in Array(3)" :key="t" class="tree">
        <div class="tree-bottom" />
        <div class="tree-top" />
      </li>
    </ul>
    <ul class="trees trees-right">
      <li v-for="(tree, t) in Array(3)" :key="t" class="tree">
        <div class="tree-bottom" />
        <div class="tree-top" />
      </li>
    </ul>
  </div>
</template>

<script>
  import Settlement from '@/components/decor/Settlement';
  const houses = [0, 1, 2];

  export default {
    name: 'SnowyTown',
    components: {
      Settlement
    },
    created() {
      this.houses = houses;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $base-height: 50px;
  $mountains-start: 30%;
  $first-house: 36%;
  $house-width: 102px;
  $house-margin: 50px;

  $trees-count: 3;
  $trees-left-start: 12%;
  $trees-right-start: 63%;

  $tree-width: 60px;
  $tree-margin: 20px;

  .game-loader {
    position: relative;
  }

  .base {
    position: absolute;
    width: 100%;
    height: $base-height;
    border-radius: 90px;
    background: white;
    bottom: 20px; left: 0;
    
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: $base-height * 0.6;
      border-radius: 90px;
      background: #c5d5ea;
      top: $base-height * 0.8; left: 0;
    }
  }

  .mountains {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 172px solid transparent;
    border-right: 172px solid transparent;
    border-bottom: 330px solid #cacdcc;
    bottom: $base-height * 1.4; left: $mountains-start;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 132px solid transparent;
      border-right: 132px solid transparent;
      border-bottom: 271px solid #bacedb;
      top: 63px; left: -9px;
    }
    &::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 152px solid transparent;
      border-right: 152px solid transparent;
      border-bottom: 291px solid #c5d5ea;
      top: 45px; left: 99px;
    }

    .mountains-top {
      position: absolute;
      width: 0;
      height: 0;
      border-left: 45px solid transparent;
      border-right: 45px solid transparent;
      border-bottom: 90px solid white;
      top: 0; left: -45px;
      z-index: 2;

      &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 33px solid transparent;
        border-right: 33px solid transparent;
        border-bottom: 70px solid white;
        top: 63px; left: 89px;
      }

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 44px solid transparent;
        border-right: 44px solid transparent;
        border-bottom: 80px solid white;
        top: 50px; left: 207px;
      }
    }

    .mountain-shadow {
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 330px solid rgba(0, 0, 0, 0.3);
      border-right: 172px solid transparent;
      z-index: 2;

      &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 270px solid rgba(0, 0, 0, 0.3);
        border-right: 121px solid transparent;
        top: 60px; left: 123px;
        z-index: 2;
      }

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 291px solid rgba(0, 0, 0, 0.3);
        border-right: 152px solid transparent;
        top: 40px; left: 251px;
        z-index: 2;
      }
    }
  }

  .house {
    &.house-0 {
      background: #dd33b0;
      border-right: 5px solid #ce08a6;
      bottom: $base-height * 1.35; left: $first-house;

      &::after {
        border-bottom: 50px solid #dd33b0;
      }
    }

    &.house-1 {
      background: #33007c;
      border-right: 5px solid #16002d;
      bottom: $base-height * 1.35; left: calc(#{$first-house} + #{$house-width } + #{$house-margin});

      &::after {
        border-bottom: 50px solid #33007c;
      }
    }

    &.house-2 {
      background: #0063dd;
      border-right: 5px solid #003989;
      bottom: $base-height * 1.35; left: calc(#{$first-house} + #{$house-width} * 2 + #{$house-margin} * 2);

      &::after {
        border-bottom: 50px solid #0063dd;
      }
    }
  }

  @mixin tree-positions($start) {
    @for $t from 0 to $trees-count {
      
      &:nth-child(#{$t + 1}) {
        left: calc(#{$start} + #{$tree-width * $t} + #{$tree-margin * $t});
      }
    }
  }

  .trees {
    list-style: none;
    position: absolute;
    bottom: $base-height * 1.15;
    z-index: 5;

    &.trees-left {
      left: $trees-left-start;

      .tree {
        @include tree-positions($trees-left-start);
      }
    }

    &.trees-right {
      left: $trees-right-start;

      .tree {
        @include tree-positions($trees-right-start);
      }
    }

    .tree {
      display: inline-block;
      width: 0;
      height: 0;
      border-bottom: 30px solid white;
      border-left: 30px solid transparent;
      position: relative;
      bottom: 28px;

      &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 30px solid gray;
        border-right: 30px solid transparent;
      }

      &::after {
        content: '';
        position: absolute;
        width: 9px;
        height: 12px;
        background: gray;
        top: 42px; left: -5px;
      }

      .tree-bottom {
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 33px solid white;
        border-left: 33px solid transparent;
        margin: 12px -33px;

        &::before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border-bottom: 33px solid gray;
          border-right: 33px solid transparent;
        }
      }

      .tree-top {
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 21px solid white;
        border-left: 21px solid transparent;
        margin: -9px -21px;

        &::before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border-bottom: 21px solid gray;
          border-right: 21px solid transparent;
        }
      }
    }
  }
</style>
