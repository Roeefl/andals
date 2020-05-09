<template>
  <div class="wildling-spawn">
    <fragment v-for="(count, type) in counts" :key="`type-${type}`">
      <Wildling v-for="(wildling, w) in Array(count || 0).fill(type)" :key="w" :type="type" :size="30" class="wildling" />
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

      //  allWildlings: function() {
      //   const flatWildlings = Object.entries(this.counts)
      //     .map(([key, count]) => new Array(count || 0).fill(key))
      //     .flat();

      //   return shuffle(flatWildlings);
      // }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  .wildling-spawn {
    padding: $spacer;
    display: flex;
    flex-flow: row wrap;
  }

  .wildling {
    margin-left: $spacer / 2;
    margin-bottom: $spacer / 2;
  }
</style>
