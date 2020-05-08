<template>
  <div class="purchase-confirm">
    <h3 class="header">
      {{ header }}
    </h3>
    <div v-if="!isFree && !removing" class="confirm-move">
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
    <div class="confirm-actions">
      <BaseButton
        icon
        iconName="cancel"
        iconColor="red"
        iconSize="40px"
        @click="onCancel"
      />
      <BaseButton
        icon
        iconName="check-all"
        iconSize="40px"
        iconColor="light-green darken-2"
        :clickable="!isFlexible || (!swapWhich && !swapWith.resource) || (!!swapWhich && !!swapWith.resource)"
        @click="onConfirm"
      />
    </div>
  </div>
</template>

<script>
  import colyseusService from '@/services/colyseus';
  import { resourceCardTypes } from '@/specs/resources';
  import { GAME_CARD } from '@/specs/purchases';

  import ResourceCard from '@/components/game/ResourceCard';
  import BaseDeck from '@/components/game/BaseDeck';
  import BaseButton from '@/components/common/BaseButton';
  import GameCards from '@/components/interface/GameCards';

  export default {
    name: 'PurchaseConfirm',
    components: {
      ResourceCard,
      BaseDeck,
      GameCards,
      BaseButton
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
        default: null
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

  .purchase-confirm {
    background: $secondary;
    box-shadow: 0px 0px 6px 6px $success;
    border-radius: 40px;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .header {
      color: $primary;
      align-self: center;
    }

    .confirm-move {
      display: flex;
      flex-direction: column;
      padding: $spacer / 2;

      .cost {
        display: flex;
        margin: $spacer / 2 0;
        padding: $spacer / 2 0;
        border-bottom: 1px solid black;
      }
    }

    .confirm-actions {
      flex: 1;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }
  
  .resources-deck {
    margin-top: $spacer;
  }
</style>
