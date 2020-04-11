<template>
  <div class="building-costs">
    <section class="resource-type" v-for="section in buildingCosts" :key="section.type">
      <div class="description">
        <h3 class="purchase-type">
          <BaseIcon :name="structureIcons[section.type]" size="20px" color="black" />
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
        />    
      </div>
    </section>
    <footer>
      <h5 class="paragraph">
        A city replaces an already-built settlement.
      </h5>
      <h5 class="paragraph">
        Usually, you only play 1 Development Card per turn, and you cannot play a Development Card on the same turn you purchased it.
      </h5>
    </footer>
  </div>
</template>

<script>
  import ResourceCard from '@/components/game/ResourceCard';
  import BaseIcon from '@/components/common/BaseIcon';

  import { resourceCardTypes } from '@/specs/resources';
  import buildingCosts from '@/utils/buildingCosts';
  import { structureIcons } from '@/specs/gamePieces';

  export default {
    name: 'BuildingCosts',
    components: {
      ResourceCard,
      BaseIcon
    },
    created() {
      this.buildingCosts = buildingCosts;
      this.structureIcons = structureIcons;
      this.resourceCardTypes = resourceCardTypes;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .building-costs {
    padding: $spacer / 2;

    .resource-type {
      display: grid;
      grid-template-columns: 40% 60%;

      border-bottom: 1px solid gray;
      margin: $spacer / 2 0;
      padding: $spacer / 2 0;

      .description {
        display: flex;
        flex-direction: column;

        .purchase-type {
          display: grid;
          grid-template-columns: 30% 70%;
        }

        .vp {
          font-size: $font-size-sm;
        }
      }

      .cost {
        display: flex;
      }
    }
  }

  .paragraph {
    font-size: $font-size-sm;
    margin: $spacer / 3 0;
    padding: $spacer / 3 0;
  }
</style>