<template>
  <div class="clan-area">
    <div class="clan-symbol">
      <BaseIcon :name="clan.icon" :color="clanColors[clan.name]" size="140px" />
    </div>
    <div class="clan-camps">
      <div
        v-for="(campfire, c) in Array(campfires).fill(8)"
        :key="c"
        class="clan-camp"
      >
        <BaseIcon name="campfire" color="red" :size="`${campfire * (campfires - c + 1)}px`" class="campfire-icon" />
        <Wildling
          v-if="camps[c]"
          :type="camps[c].type"
          :size="40"
          @remove="$emit('remove-wildling', c)"
          class="wildling"
        />
      </div>
    </div>
    <div class="clan-trails">
      <ClanTrail v-for="(trailValues, t) in trails" :key="`trail-${t}`" :value="trailDisplayValue(trailValues)" />
    </div>
  </div>
</template>

<script>
  import ClanTrail from '@/components/north/ClanTrail';
  import Wildling from '@/components/pieces/Wildling';
  import BaseIcon from '@/components/common/BaseIcon';

  import { clanColors } from '@/specs/clans';

  export default {
    name: 'ClanArea',
    components: {
      ClanTrail,
      Wildling,
      BaseIcon
    },
    props: {
      clan: {
        type: Object,
        required: true
      },
      campfires: {
        type: Number,
        default: 5
      },
      camps: {
        type: Array,
        default: () => []
      },
      trails: {
        type: Array,
        required: true
      }
    },
    created() {
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
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .clan-symbol {
      position: absolute;
      top: 5%;
      left: 0;
      opacity: 0.4;
    }

    .clan-camps {
      flex: 1;
      display: flex;
      flex-direction: column-reverse;

      .clan-camp {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: center;
      }

      .wildling {
        position: absolute;
        top: -$spacer / 2;
        left: $spacer * 2;
      }
    }

    .clan-trails {
      display: flex;
      justify-content: space-evenly;
    }
  }
</style>
