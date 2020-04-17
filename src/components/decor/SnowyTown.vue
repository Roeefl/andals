<template>
  <div class="game-loader">
    <div class="mountains">
      <div class="mountains-top" />
      <div class="mountain-shadow" />
    </div>
    <div class="base" />
    <div class="house house-1">
      <div class="window">
        <div class="window-inner" />
      </div>
      <div class="chimney" />
    </div>
    <div class="house house-2">
      <div class="window window-middle">
        <div class="window-inner" />
      </div>
      <div class="chimney" />
    </div>
    <div class="house house-3">
      <div class="window">
        <div class="window-inner" />
      </div>
      <div class="chimney" />
    </div>
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

<style scoped lang="scss">
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
    position: absolute;
    width: $house-width;
    height: 80px;
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
  
  .house-1 {
    background: #dd33b0;
    border-right: 5px solid #ce08a6;
    bottom: $base-height * 1.35; left: $first-house;

    &::after {
      border-bottom: 50px solid #dd33b0;
    }
  }

  .house-2 {
    background: #33007c;
    border-right: 5px solid #16002d;
    bottom: $base-height * 1.35; left: calc(#{$first-house} + #{$house-width } + #{$house-margin});

    &::after {
       border-bottom: 50px solid #33007c;
    }
  }

  .house-3 {
    background: #0063dd;
    border-right: 5px solid #003989;
    bottom: $base-height * 1.35; left: calc(#{$first-house} + #{$house-width} * 2 + #{$house-margin} * 2);

    &::after {
      border-bottom: 50px solid #0063dd;
    }
  }

  .window {
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

    &.window-middle {
      &::before {
        background: #333;
      }

      &::after {
        background: #edca4e;
      }

      .window-inner {
        &::before {
           background: #edca4e;
        }

        &::after {
          background: #333;
        }
      }
    }

    .window-inner {
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
