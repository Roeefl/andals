<template>
  <div class="wildling-spawn">
    <fragment v-for="(count, type, index) in wildlings" :key="`type-${index}`">
      <Wildling v-for="(wildling, w) in Array(count).fill(type)" :key="w" :type="type" class="wildling" />
    </fragment>
  </div>
</template>

<script>
  import Wildling from '@/components/pieces/Wildling';
  // import { wildlingIcons, wildlingColors, WILDLING_REGULAR, WILDLING_CLIMBER, WILDLING_GIANT } from '@/specs/wildlings';

  export default {
    name: 'WildlingSpawn',
    components: {
      Wildling
    },
    props: {
      wildlings: {
        type: Object,
        default: () => {}
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wildling {
    margin-right: $spacer;
    margin-bottom: $spacer;
  }
</style>
