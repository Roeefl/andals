<template>
  <div class="building-costs">
    <section v-for="(costs, name) in buildingCosts" :key="name" class="resource-type" :class="{ 'full': full }">
      <div class="description">
        <h3 class="purchase-type">
          <BaseIcon :name="structureIcons[name]" size="20px" :color="color" />
          <span v-if="full">
            {{ name }}
          </span>
        </h3>
        <span v-if="full" class="vp">
          {{ victoryPointsPerPurchase[name] }} Victory Points
        </span>
      </div>
      <div v-if="full" key="full-building-costs" class="cost">
        <ResourceCard
          v-for="resource in resourceCardTypes"
          :key="resource"
          :resource="resource"
          :count="costs[resource]"
        />    
      </div>
      <div v-else key="collapsed-building-costs" class="cost">
        <fragment v-for="resource in resourceCardTypes" :key="resource" v-show="costs[resource] > 0">
          <ResourceCard
            v-for="(resourceCard, index) in Array(costs[resource] || 0).fill(resource)"
            :key="`card-${resource}-${index}`"
            :resource="resource"
            small
            hideCount
            :color="counts[resource] >= costs[resource] ? '#43A047' : 'white'"
            :iconColor="counts[resource] >= costs[resource] ? 'white' : null"
            class="resource-card"
            :class="{ 'mini-card': !full }"
          />
        </fragment>
      </div>
    </section>
    <footer v-if="full">
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
  import colyseusService from '@/services/colyseus';
  
  import ResourceCard from '@/components/game/ResourceCard';
  import BaseIcon from '@/components/common/BaseIcon';

  import { resourceCardTypes, resourceCardColors } from '@/specs/resources';
  import { structureIcons } from '@/specs/gamePieces';
  import { victoryPointsPerPurchase } from '@/specs/purchases';

  export default {
    name: 'BuildingCosts',
    components: {
      ResourceCard,
      BaseIcon
    },
    props: {
      full: {
        type: Boolean,
        default: true
      },
      color: {
        type: String,
        default: 'primary'
      },
      counts: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      buildingCosts: () => colyseusService.buildingCosts
    },
    created() {
      this.victoryPointsPerPurchase = victoryPointsPerPurchase;
      this.structureIcons = structureIcons;
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
      display: flex;
      align-items: center;
      height: 20%;

      &.full {
        display: grid;
        grid-template-columns: 40% 60%;
        height: auto;
        margin: $spacer / 2 0;
        padding: $spacer / 2 0;
        border-bottom: 1px solid gray;
      }

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

  .mini-card {
    width: 30px;
    height: 30px;
  }
</style>