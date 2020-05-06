<template>
  <v-dialog
    width="600"
    :value="isOpen"
    @click:outside="onCancel"
  >
    <ActionCard
      :title="`Confirm ${removing ? 'Removal' : 'Purchase'}: ${type}`"
      @cancel="onCancel"
      :approve="!isFlexible || (!swapWhich && !swapWith.resource) || (!!swapWhich && !!swapWith.resource)"
      @approve="onConfirm"
    >
     <div v-if="!isFree && !removing" class="confirm-move">
      <h2>
        {{ header }} {{ type }}
      </h2>
      <div>
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
      <div v-if="type === GAME_CARD && selectionCount > 0">
        <GameCards
          visible
          :deck="gameCards.slice(0, selectionCount)"
          @game-card-clicked="$emit('yes', $event)"
          class="game-cards"
        />
      </div>
    </div>
  </ActionCard>
  </v-dialog>
</template>

<script>
  import colyseusService from '@/services/colyseus';
  import { resourceCardTypes } from '@/specs/resources';
  import { GAME_CARD } from '@/specs/purchases';

  import ResourceCard from '@/components/game/ResourceCard';
  import ActionCard from '@/components/common/ActionCard';
  import BaseDeck from '@/components/game/BaseDeck';
  import GameCards from '@/components/interface/GameCards';

  export default {
    name: 'PurchaseConfirm',
    components: {
      ResourceCard,
      ActionCard,
      BaseDeck,
      GameCards
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
      header: {
        type: String,
        default: 'Building Costs for'
      },
      removing: {
        type: Boolean,
        default: false
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
      },
      gameCards: {
        type: Array,
        default: () => []
      },
      selectionCount: {
        type: Number,
        default: 0
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
            .filter(([resource, count]) => count > this.buildingCosts[this.type][resource])
            .map(([resource, count]) => [resource, count - this.buildingCosts[this.type][resource]])
        );
      }
    },
    created() {
      this.resourceCardTypes = resourceCardTypes;
      this.GAME_CARD = GAME_CARD;
    },
    methods: {
      onResourceClick: function(resource) {
        if (this.myPlayer.resourceCounts[resource] === 0)
          this.swapWhich = resource;
      },
      onDestroy: function() {
        this.swapWhich = {};
        this.swapWith = {};
      },
      onCancel: function() {
        this.onDestroy();
        this.$emit('no');
      },
      onConfirm: function() {
        this.$emit('yes', this.isFlexible ? { swapWhich: this.swapWhich, swapWith: sthis.wapWith.resource } : {});
        this.onDestroy();
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
      border-bottom: 1px solid black;
    }
  }

  .cost {
    display: flex;
  }
  
  .resources-deck {
    margin-top: $spacer;
  }
</style>
