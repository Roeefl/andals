<template>
  <div class="dev-console">
    <ul>
      <NodeTree :node="roomState" :isRoot="true" />
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  import NodeTree from '@/components/interface/NodeTree';
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'DevConsole',
    components: {
      NodeTree,
      BaseIcon
    },
    computed: mapState([
      'roomState'
    ]),
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .dev-console {
    background: $primary;
    color: $secondary;
    font-size: $font-size-md;
    display: flex;
    flex-direction: column;
  }
</style>
