<template>
  <div class="clan-clearing">
    <BaseIcon color="secondary" name="tent" size="50px" class="clearing-icon" />
    <Wildling
      v-for="(wildling, w) in clearing.wildlings"
      :key="`wildling-${wildling.type}-${w}`"
      :type="wildling.type"
      :size="30"
      @remove="$emit('remove-wildling', w)"
      class="wildling"
    />
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
  }

  .wildling {
    margin-right: 3px;
  }
</style>
