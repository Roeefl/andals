<template>
  <div class="wildling-camps">
    <div v-for="(section, s) in sectionNames" :key="`section-${s}`" class="wildling-section">
      <ClanArea
        v-if="section !== WOODS && clanAreas"
        :clan="clans[section]"
        :trails="clanTrails[section].trails"
        :campfires="clanAreas[section].campfires"
        :camps="clanAreas[section].camps"
        @remove-wildling="$emit('remove-wildling', { clanName: clans[section].name, campIndex: $event })"
      />
      <div v-if="section === WOODS" class="trees">
        <Tree v-for="(tree, t) in Array(44).fill(0)" :key="t" :size="12" leftColor="#90A4AE" rightColor="green" class="tree" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import { clanNames, clans } from '@/specs/clans';

  import ClanArea from '@/components/north/ClanArea';
  import Tree from '@/components/decor/Tree';

  const WOODS = 'WOODS';
  const sectionNames = clanNames.map(clan => [WOODS, clan, WOODS]).flat();

  export default {
    name: 'WildlingCamps',
    components: {
      ClanArea,
      Tree
    },
    computed: {
      clanTrails: () => colyseusService.clanTrails,
      ...mapGetters([
        'clanAreas'
      ])
    },
    created() {
      this.clans = clans;
      this.sectionNames = sectionNames;
      this.WOODS = WOODS;

      // console.log(this.clanTrails);
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wildling-camps {
    display: flex;

    .wildling-section {
      flex: 1;
    }

    .trees {
      padding-top: $spacer * 2;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: $spacer * 0.7;
    }
  }
</style>
