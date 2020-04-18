<template>
  <div class="clan-area">
    <div class="clan-symbol">
      <BaseIcon color="brown" :name="clan.icon" size="30px" />
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
      />
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
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';

  const campfires = [6, 8, 10, 12, 14];

  export default {
    name: 'ClanArea',
    components: {
      ClanTrail,
      ClanClearing,
      BaseButton,
      BaseIcon
    },
    props: {
      clan: {
        type: Object,
        required: true
      }
    },
    created() {
      this.campfires = campfires;
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
      flex-direction: column;
    }

    .clan-trails {
      display: flex;
    }
  }
</style>
