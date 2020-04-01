<template>
  <div class="building-costs">
    <section class="section" v-for="section in sections" :key="section.type">
      <div class="info">
        <h3>
          {{ section.type }}
        </h3>
        <span class="vp">
          {{ section.vp }} victory points
        </span>
      </div>
      <div class="cost">

      </div>
    </section>
    <footer>
      <h5>
        A city replaces an already-built settlement.
      </h5>
      <h5>
        Usually, you only play 1 Development Card per turn, and you cannot play a Development Card on the same turn you fetched it.
      </h5>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'BuildingCosts',
    // components: {
    // },
    data: () => ({
      sections: [
        {
          type: 'road',
          vp: 0,
          lumber: 1,
          brick: 1
        },
        {
          type: 'settlement',
          vp: 1,
          lumber: 1,
          brick: 1,
          wheat: 1,
          sheep: 1
        },
        {
          type: 'city',
          vp: 2,
          wheat: 2,
          ore: 3
        },
        {
          type: 'card',
          vp: 0,
          sheep: 1,
          wheat: 1,
          ore: 1
        }
      ]
    })
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .building-costs {
    padding: $spacer / 2;

    .section {
      display: flex;

      .info {
        display: flex;
        flex-direction: column;

        .vp {
          font-size: $font-size-xs;
        }
      }
    }
  }
</style>