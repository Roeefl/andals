<template>
  <li class="node-tree">
    <BaseButton icon :iconName="collapsed ? 'plus' : 'minus'" iconSize="26px" iconColor="secondary" @click="collapsed = !collapsed" />
    <div v-if="isRoot">
      Root ({{ Object.keys(node).length }})
    </div>
    <div v-if="!collapsed" class="node-items-wrapper">
      <div v-for="(value, key, index) in node" :key="`${key}-${index}`">
        <ul v-if="typeof value === 'object'">
          <h3 class="node-header">
            {{ key }} ({{ Object.keys(value).length }})
          </h3>
          <NodeTree :node="value" />
        </ul>
        <div v-else class="node-item">
          <span class="node-key">
            {{ key }}:
          </span>
          <span class="node-value">
            {{ value }}
          </span>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'NodeTree',
    components: {
      BaseButton
    },
    props: {
      node: {
        type: Object | String | Number,
        required: true
      },
      isRoot: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      collapsed: false
    })
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .node-items-wrapper {
    padding-left: $spacer * 3;

    .node-header {
      color: red;
    }

    .node-item {
      .node-key {
        font-weight: 900;
      }

      .node-value {
        font-style: italic;
      }
    }
  }
</style>
