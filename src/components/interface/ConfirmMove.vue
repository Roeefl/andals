<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="600"
  >
    <ActionCard
      :title="`Confirm Purchase: ${type}`"
      @cancel="$emit('no')"
      :approve="!isFlexible || (!!swapWhich && !!swapWith.resource)"
      @approve="$emit('yes', isFlexible ? { swapWhich, swapWith: swapWith.resource } : {})"
    >
     <div class="confirm-move">
      <h2>
        Build {{ type }} for:
      </h2>
      <div v-if="!isFree">
        <div class="cost">
          <ResourceCard
            v-for="resource in resourceCardTypes"
            :key="resource"
            v-show="buildingCosts[type][resource]"
            :resource="resource"
            :count="buildingCosts[type][resource]"
            :selected="swapWhich === resource"
            @clicked="onResourceClick(resource)"
          />
        </div>
      </div>
      <div v-if="isFlexible">
        <h3>
          Flexible Purchase Allowed
        </h3>
        <h4>
          Swap out the selected resource with:
        </h4>
        <BaseDeck :deck="swappableResources" @card-clicked="swapWith = $event" :selectedCards="[swapWith]" class="resources-deck" />
      </div>
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
      swapWhich: {},
      swapWith: {},
    }),
    computed: {
      buildingCosts: () => colyseusService.buildingCosts,
      swappableResources: function() {
        return Object.fromEntries(
          Object
            .entries(this.myPlayer.resourceCounts)
            .filter(([resource, count], index) => count > this.buildingCosts[this.type][resource])
        );
      }
    },
    created() {
      this.resourceCardTypes = resourceCardTypes;
    },
    methods: {
      onResourceClick: function(resource) {
        if (this.myPlayer.resourceCounts[resource] === 0)
          this.swapWhich = resource;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .confirm-move {
    display: flex;
    flex-direction: column;
    padding: $spacer / 2;

    & > * {
      margin: $spacer / 2 0;
      padding: $spacer / 2 0;
      border-top: 1px solid black;
    }
  }

  .cost {
    display: flex;
  }
  
  .resources-deck {
    margin-top: $spacer;
  }
</style>
