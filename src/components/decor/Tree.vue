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
      color: {
        type: String,
        default: 'gray'
      }
    },
    computed: {
      treeStyle: function() { 
        return {
          '--leaf-color': this.color
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

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
      border-bottom: 30px solid var(--leaf-color);
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
        border-bottom: 33px solid var(--leaf-color);
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
        border-bottom: 21px solid var(--leaf-color);
        border-right: 21px solid transparent;
      }
    }
  }
 </style>