<template>
  <div class="clan-clearing">
    <BaseIcon color="black" name="tent" size="32px" class="clearing-icon" />
    <fragment v-for="(count, type) in counts" :key="`type-${type}`">
      <Wildling v-for="(wildling, w) in Array(count).fill(type)" :key="w" :type="type" size="20px" class="wildling" />
    </fragment>
  </div>
</template>

<script>
  import Wildling from '@/components/pieces/Wildling';
  import BaseIcon from '@/components/common/BaseIcon';

  const countsMock = {
    regular: 0,
    climber: 0,
    giant: 0
  };

  export default {
    name: 'ClanClearing',
    components: {
      Wildling,
      BaseIcon
    },
    props: {
      counts: {
        type: Object,
        default: () => countsMock
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .clan-clearing {
    width: 100%;
    height: 50px;
    position: relative;
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    .clearing-icon {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-40%);
    }
  }

  .wildling {
    margin-right: 3px;
  }
</style>
