<template>
  <div class="clan-clearing" :class="`clearing-${clearingIndex}`">
    <div class="trees trees-left">
      <Tree v-for="(tree, t) in Array(clearingIndex * 2 + 1).fill(0)" :key="t" :size="12" rightColor="#90A4AE" leftColor="green" class="tree" />
    </div>
    <BaseIcon color="secondary" name="tent" size="40px" class="clearing-icon" />
    <Wildling
      v-for="(wildling, w) in clearing.wildlings"
      :key="`wildling-${wildling.type}-${w}`"
      :type="wildling.type"
      :size="30"
      @remove="$emit('remove-wildling', w)"
      class="wildling"
    />
    <div class="trees trees-right">
      <Tree v-for="(tree, t) in Array((4 - clearingIndex) + 1).fill(0)" :key="t" :size="12" rightColor="#90A4AE" leftColor="green" class="tree" />
    </div>
    <span v-for="(clan, c) in clearing.clans" :key="`clan-${c}`" />
  </div>
</template>

<script>
  import Wildling from '@/components/pieces/Wildling';
  import BaseIcon from '@/components/common/BaseIcon';
  import Tree from '@/components/decor/Tree';

  export default {
    name: 'WildlingClearing',
    components: {
      Wildling,
      BaseIcon,
      Tree
    },
    props: {
      clearingIndex: {
        type: Number,
        required: true
      },
      clearing: {
        type: Object,
        default: () => ({
          wildlings: [],
          trails: [],
          clans: []
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .clan-clearing {
    position: relative;
    color: $secondary;

    .clearing-icon {
      position: absolute;
      top: 0;
      left: 30%;
      opacity: 0.7;
    }

    &.clearing-0 {
      .clearing-icon {
        left: 20%;
      }

      .trees-right {
        left: 40%;
      }
    }

    &.clearing-1 {
      .clearing-icon {
        left: 25%;
      }

      .trees-right {
        left: 45%;
      }
    }

    &.clearing-2 {
      .clearing-icon {
        left: 60%;
      }

      .trees-right {
        left: 80%;
      }
    }

    &.clearing-3 {
      .clearing-icon {
        left: unset;
        right: 10%;
      }

      .trees-right {
        right: 0;
      }
    }
  }

  .wildling {
    margin-right: 3px;
  }

  .trees {
    position: absolute;
    top: $spacer * 2;
    display: flex;
    opacity: 0.5;
    
    &.trees-left {
      left: 0;
    }
  }
  
  .tree {
    & + & {
      margin-left: $spacer * 0.7;
    }
  }
</style>
