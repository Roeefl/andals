<template>
  <div class="building-costs">
    <section class="resource-type" v-for="section in buildingCosts" :key="section.type">
      <div class="description">
        <h3>
          {{ section.type }}
        </h3>
        <span class="vp">
          {{ section.vp }} victory points
        </span>
      </div>
      <div class="cost">
        <ResourceCard
          v-for="resource in resourceCardTypes"
          :key="resource"
          :resource="resource"
          :count="section[resource]"
          class="resource-card"
        />    
      </div>
    </section>
    <footer>
      <h5 class="paragraph">
        A city replaces an already-built settlement.
      </h5>
      <h5 class="paragraph">
        Usually, you only play 1 Development Card per turn, and you cannot play a Development Card on the same turn you fetched it.
      </h5>
    </footer>
  </div>
</template>

<script>
  import { resourceCardTypes, resourceNameToIcon, resourceCardColors } from '@/utils/tileManifest';
  import buildingCosts from '@/utils/buildingCosts';
  import ResourceCard from '@/components/ResourceCard';

  export default {
    name: 'BuildingCosts',
    components: {
      ResourceCard
    },
    created() {
      this.buildingCosts = buildingCosts;
      this.resourceNameToIcon = resourceNameToIcon;
      this.resourceCardTypes = resourceCardTypes;
      this.resourceCardColors = resourceCardColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .building-costs {
    padding: $spacer / 2;

    .resource-type {
      display: grid;
      grid-template-columns: 1fr 1fr;

      border-bottom: 1px solid gray;
      margin: $spacer / 2 0;
      padding: $spacer / 2 0;

      .description {
        display: flex;
        flex-direction: column;

        .vp {
          font-size: $font-size-sm;
        }
      }
    }
  }

  .paragraph {
    margin: $spacer / 3 0;
    padding: $spacer / 3 0;
  }
</style>