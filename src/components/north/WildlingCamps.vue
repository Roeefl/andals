<template>
  <div class="wildling-camps">
    <div v-for="(clanSection, c) in clanSections" :key="c" class="clan-section">
      <div v-for="(area, a) in clanSection" :key="a" class="section-part">
        <ClanArea
          v-if="clanAreas && area !== WOODS"
          :key="area"
          :clan="clans[area]"
          :trails="clanTrails[area].trails"
          :campfires="clanAreas[area].campfires"
          :camps="clanAreas[area].camps"
          @remove-wildling="$emit('remove-wildling', { clanName: clans[area].name, campIndex: $event })"
        />
        <div v-else key="woods" class="trees">
          <Tree v-for="(tree, t) in Array(52).fill(0)" :key="t" :size="12" leftColor="#90A4AE" rightColor="green" />
        </div>
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
      this.clanSections = clanNames.map(clan => [WOODS, clan, WOODS]);
      this.WOODS = WOODS;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wildling-camps {
    display: flex;

    .clan-section {
      flex: 1;
      display: grid;
      grid-template-columns: 25% 50% 25%;
    }
    
    .trees {
      padding-top: $spacer * 1.5;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      justify-content: center;
      grid-gap: $spacer / 2;
    }
  }
</style>
