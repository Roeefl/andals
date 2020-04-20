<template>
  <div class="wildling-camps">
    <div v-for="(section, s) in sectionNames" :key="`section-${s}`" class="wildling-section" :class="{ 'woods': section === WOODS }">
      <ClanArea v-if="section !== WOODS && roomState.clanCamps" :clan="clans[section]" :camps="roomState.clanCamps[section].camps" :trails="clanTrails[section].trails" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import ClanArea from '@/components/north/ClanArea';
  import { clanNames, clans } from '@/specs/clans';

  const WOODS = 'WOODS';
  const sectionNames = clanNames.map(clan => [WOODS, clan, WOODS]).flat();

  export default {
    name: 'WildlingCamps',
    components: {
      ClanArea
    },
    computed: {
      clanTrails: () => colyseusService.clanTrails,
      ...mapState([
      'roomState'
      ])
    },
    created() {
      this.clans = clans;
      this.sectionNames = sectionNames;
      this.WOODS = WOODS;

      console.log(this.clanTrails);
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wildling-camps {
    display: flex;

    .wildling-section {
      flex: 1;

      &.woods {
        background-image: url('../../assets/snowy-trees-sm.png');
        background-repeat: repeat;
        // background-clip: content-box;
      }
    }
  }
</style>
