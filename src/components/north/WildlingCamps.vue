<template>
  <div class="wildling-camps">
    <div v-for="(section, s) in sections" :key="`section-${s}`" class="wildling-section" :class="{ 'woods': section === WOODS }">
      <ClanArea v-if="section !== WOODS" :clan="section" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import ClanArea from '@/components/north/ClanArea';
  import { clans } from '@/specs/clans';

  const WOODS = 'WOODS';
  const sections = clans.map(clan => [WOODS, clan, WOODS]).flat();

  export default {
    name: 'WildlingCamps',
    components: {
      ClanArea
    },
    computed: mapState([
      'roomState'
    ]),
    created() {
      this.sections = sections;
      this.WOODS = WOODS;
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
