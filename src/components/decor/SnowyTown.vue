<template>
  <div class="game-loader">
    <Mountains class="mountains" />
    <div class="base" />
    <Settlement v-for="(house, h) in houses" :key="h" class="house" :class="`house-${h}`" />
    <ul class="trees trees-left">
      <Tree v-for="(tree, t) in Array(3)" :key="t" class="tree" />
    </ul>
    <ul class="trees trees-right">
      <Tree v-for="(tree, t) in Array(3)" :key="t" class="tree" />
    </ul>
  </div>
</template>

<script>
  import Settlement from '@/components/decor/Settlement';
  import Mountains from '@/components/decor/Mountains';
  import Tree from '@/components/decor/Tree';
  
  const houses = [0, 1, 2];

  export default {
    name: 'SnowyTown',
    components: {
      Settlement,
      Mountains,
      Tree
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
    bottom: $base-height * 1.4;
    left: $mountains-start;
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
  }
</style>
