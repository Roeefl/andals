<template>
  <div class="clan-clearing">
    <BaseIcon color="black" name="tent" size="50px" class="clearing-icon" />
    <fragment v-for="(count, type) in clearing.counts" :key="`type-${type}`">
      <Wildling v-for="(wildling, w) in Array(count).fill(type)" :key="w" :type="type" :size="30" class="wildling" />
    </fragment>
    <span v-for="(clan, c) in clearing.clans" :key="`clan-${c}`" />
  </div>
</template>

<script>
  import Wildling from '@/components/pieces/Wildling';
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'WildlingClearing',
    components: {
      Wildling,
      BaseIcon
    },
    props: {
      clearing: {
        type: Object,
        default: () => ({
          counts: {},
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
  }

  .wildling {
    margin-right: 3px;
  }
</style>
