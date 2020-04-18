<template>
  <div class="wildling-spawn">
    <fragment v-for="(count, type) in counts" :key="`type-${type}`">
      <Wildling v-for="(wildling, w) in Array(count).fill(type)" :key="w" :type="type" class="wildling" />
    </fragment>
  </div>
</template>

<script>
  // import { shuffle } from 'lodash';
  // import { wildlingIcons, wildlingColors, WILDLING_REGULAR, WILDLING_CLIMBER, WILDLING_GIANT } from '@/specs/wildlings';
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

  .wildling {
    margin-right: $spacer;
    margin-bottom: $spacer;
  }
</style>
