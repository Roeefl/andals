<template>
  <div class="tree" :style="treeStyle">
    <div class="tree-bottom" />
    <div class="tree-top" />
  </div>
</template>

<script>
  export default {
    name: 'Tree',
    props: {
      size: {
        type: Number,
        default: 30
      },
      leftColor: {
        type: String,
        default: 'white',
      },
      rightColor: {
        type: String,
        default: 'gray'
      }
    },
    computed: {
      treeStyle: function() { 
        return {
          '--left-color': this.leftColor,
          '--right-color': this.rightColor,
          '--tree-size': `${this.size}px`
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .tree {
    position: relative;
    display: inline-block;
    width: 0;
    height: 0;
    border-bottom: var(--tree-size) solid var(--left-color);
    border-left: var(--tree-size) solid transparent;
    bottom: var(--tree-size);

    &::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: var(--tree-size) solid var(--right-color);
      border-right: var(--tree-size) solid transparent;
    }

    // Trunk
    &::after {
      content: '';
      position: absolute;
      width: calc(var(--tree-size) * 0.3);
      height: calc(var(--tree-size) * 0.4);
      background: gray;
      top: calc(var(--tree-size) * 1.35);
      left: calc(var(--tree-size) * -0.17);
    }

    .tree-bottom {
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: var(--tree-size) solid var(--left-color);
      border-left: calc(var(--tree-size) * 1.1) solid transparent;
      margin: calc(var(--tree-size) * 0.4) calc(var(--tree-size) * -1.1);

      &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: var(--tree-size) solid var(--right-color);
        border-right: calc(var(--tree-size) * 1.1) solid transparent;
      }
    }

    .tree-top {
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: calc(var(--tree-size) * 0.7) solid var(--left-color);
      border-left: calc(var(--tree-size) * 0.7) solid transparent;
      margin: calc(var(--tree-size) * -0.3) calc(var(--tree-size) * -0.7);

      &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: calc(var(--tree-size) * 0.7) solid var(--right-color);
        border-right: calc(var(--tree-size) * 0.7) solid transparent;
      }
    }
  }
 </style>