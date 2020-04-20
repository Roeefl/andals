<template>
  <div class="clan-area">
    <div class="clan-symbol">
      <BaseIcon :name="clan.icon" :color="clanColors[clan.name]" size="30px" />
    </div>
    <div class="clan-camps">
      <BaseButton
        v-for="(campfire, c) in campfires"
        :key="c"
        icon
        iconName="campfire"
        iconColor="red"
        :iconSize="`${campfire}px`"
        class="clan-camp"
      >
        <Wildling v-if="camps[c]" :type="camps[c]" :size="40" class="wildling" />
      </BaseButton>
    </div>
    <div class="clan-trails">
      <ClanTrail v-for="(trailValues, t) in clan.trails" :key="`trail-${t}`" :value="trailDisplayValue(trailValues)" />
    </div>
    <ClanClearing />
  </div>
</template>

<script>
  import ClanTrail from '@/components/north/ClanTrail';
  import ClanClearing from '@/components/north/ClanClearing';
  import Wildling from '@/components/pieces/Wildling';
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';

  import { clanColors } from '@/specs/clans';

  const campfires = [20, 16, 12, 8, 4];

  export default {
    name: 'ClanArea',
    components: {
      ClanTrail,
      ClanClearing,
      Wildling,
      BaseButton,
      BaseIcon
    },
    props: {
      clan: {
        type: Object,
        required: true
      },
      camps: {
        type: Array,
        default: () => []
      }
    },
    created() {
      this.campfires = campfires;
      this.clanColors = clanColors;
    },
    methods: {
      trailDisplayValue: function(trailValues) {
        const separator = ' / ';
        return trailValues.reduce((acc, value, i) => {
          acc += `${i > 0 ? separator : ''}${value}`;
          return acc;
        }, '');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .clan-area {
    display: flex;
    flex-direction: column;
    align-items: center;

    .clan-camps {
      display: flex;
      flex-direction: column-reverse;
      position: relative;

      .wildling {
        position: absolute;
        top: -$spacer / 2;
        left: $spacer / 2;
      }
    }

    .clan-trails {
      display: flex;
    }
  }
</style>
