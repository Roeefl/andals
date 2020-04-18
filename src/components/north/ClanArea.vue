<template>
  <div class="clan-area">
    <div class="clan-symbol">
      <BaseIcon color="black" :name="clanIcons[clan]" size="30px" />
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
    <div class="clan-trail" />
    <div class="clan-clearing" />
  </div>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  import { clanIcons, CLAN_RIVER, CLAN_CAVE, CLAN_HORNFOOT } from '@/specs/clans';

  const campfires = [6, 8, 10, 12, 14];

  export default {
    name: 'ClanArea',
    components: {
      BaseButton,
      BaseIcon
    },
    props: {
      clan: {
        type: String,
        required: true
      }
    },
    created() {
      this.clanIcons = clanIcons;
      this.campfires = campfires;
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
  }
</style>
