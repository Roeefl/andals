<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="400"
  >
   <ActionCard :title="`Confirm Purchase: ${type}`" @cancel="$emit('no')" @approve="$emit('yes')">
    <div v-if="!isFree" class="build-costs">
      Build {{ type }} for:
      <div class="cost">
        <ResourceCard
          v-for="resource in resourceCardTypes"
          :key="resource"
          :resource="resource"
          :count="buildingCosts[type][resource]"
          v-show="buildingCosts[type][resource]"
        />
      </div>
    </div>
    <div v-if="isFlexible" class="flexible-purchase">
      <h3>
        Flexible Purchase
      </h3>
      <h4>
        Swap out one of the resources with:
      </h4>
      <BaseDeck :deck="myPlayer.resourceCounts" @card-clicked="selectedResource = $event" :selectedCards="[selectedResource]" class="resources-deck" />
    </div>
  </ActionCard>
  </v-dialog>
</template>

<script>
  import colyseusService from '@/services/colyseus';
  import { resourceCardTypes } from '@/specs/resources';

  import ResourceCard from '@/components/game/ResourceCard';
  import ActionCard from '@/components/common/ActionCard';
  import BaseDeck from '@/components/game/BaseDeck';

  export default {
    name: 'ConfirmMove',
    components: {
      ResourceCard,
      ActionCard,
      BaseDeck
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        required: true
      },
      isFree: {
        type: Boolean,
        default: false
      },
      isFlexible: {
        type: Boolean,
        default: false
      },
      myPlayer: {
        type: Object,
        default: () => {}
      }
    },
    data: () => ({
      selectedResource: {}
    }),
    computed: {
      buildingCosts: () => colyseusService.buildingCosts
    },
    created() {
      this.resourceCardTypes = resourceCardTypes;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .build-costs {
    padding: $spacer;
  }

  .cost {
    display: flex;
  }

  .flexible-purchase {
    border-top: 1px solid black;
    margin: $spacer 0;
    padding: $spacer;
  }

  .resources-deck {
    padding: $spacer;
  }
</style>
