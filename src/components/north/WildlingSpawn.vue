<template>
  <div class="wildling-spawn">
    <fragment v-for="(count, type) in counts" :key="`type-${type}`">
      <Wildling v-for="(wildling, w) in Array(count || 0).fill(type)" :key="w" :type="type" :size="16" class="wildling" />
    </fragment>
  </div>
</template>

<script>
  import Wildling from '@/components/pieces/Wildling';

  export default {
    name: 'WildlingSpawn',
    components: {
      Wildling
    },
    props: {
      counts: {
        type: Object,
        default: () => {}
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  .wildling-spawn {
    padding: $spacer;
  }

  .wildling {
    margin-right: $spacer;
    margin-bottom: $spacer;
  }
</style>
