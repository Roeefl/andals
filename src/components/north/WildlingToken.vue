<template>
  <div class="wildling-token">
    <BaseIcon :size="size" :name="wildlingIcons[wildling]" :color="wildlingColors[wildling]" class="wildling-icon" />
    <BaseIcon :size="size" :name="clanIcons[clan]" :color="clanColors[clan]" class="clan-icon" />
  </div>
</template>

<script>
  import BaseIcon from '@/components/common/BaseIcon';

  import { wildlingIcons, wildlingColors } from '@/specs/wildlings';
  import { clanIcons, clanColors } from '@/specs/clans';

  export default {
    name: 'WildlingToken',
    components: {
      BaseIcon
    },
    props: {
      wildling: {
        type: String,
        required: true
      },
      clan: {
        type: String,
        required: true
      },
      size: {
        type: String,
        default: 'medium'
      }
    },
    created() {
      this.wildlingIcons = wildlingIcons;
      this.wildlingColors = wildlingColors;
      this.clanIcons = clanIcons;
      this.clanColors = clanColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $corner-distance: 2px;

  .wildling-token {
    position: relative;
    background: $primary;
    width: 32px;
    height: 32px;

    .wildling-icon {
      position: absolute;
      bottom: $corner-distance;
      right: $corner-distance;
    }

    .clan-icon {
      position: absolute;
      top: $corner-distance;
      left: $corner-distance;
    }
  }
</style>
