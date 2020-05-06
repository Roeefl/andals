<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="1000"
  >
    <ActionCard
      v-if="!!players[1]"
      closeButton
      :title="`Trading with ${players[1].nickname}`"
      :cancelText="cancelText"
      @close="$emit('refuse')"
      @cancel="$emit('refuse')"
      :approve="players[0].isAgreeToTrade && players[1].isAgreeToTrade"
      @approve="$emit('confirm-trade')"
    >
      <div class="wrapper" :class="{ 'with-chat': !withBank }">
        <div class="trade-contents">
          <drop @drop="$emit('remove-card', $event.resource)" class="my-deck">
            <h2>
              My Deck
            </h2>
            <BaseDeck :deck="players[0].resourceCounts" @card-clicked="$emit('add-card', $event)" />
          </drop>
          <drop v-for="(player, i) in players" :key="renderKey(player)" @drop="i === 0 && $emit('add-card', $event)" class="player">
            <h3>
              <BaseAvatar v-if="player.avatar" :size="40" :src="require(`../../assets/avatars/${player.avatar}.png`)" :alt="player.nickname" />
              {{ i === 0 ? 'ME' : player.nickname }}:
            </h3>
            <div class="trade-cards">
              <div v-for="resource in resourceCardTypes" :key="resource" v-show="player.tradeCounts && player.tradeCounts[resource]" class="resource-type">
                <drag 
                  v-for="(card, c) in Array(player.tradeCounts ? (player.tradeCounts[resource] || 0) : 0).fill(resource)"
                  :key="`card-${c}`"
                  :transfer-data="{ resource }"
                  class="resource-card"
                >
                  <ResourceCard
                    :resource="resource"
                    :clickable="i === 0"
                    hideCount
                    big
                    @clicked="$emit('remove-card', resource)"
                  />
                </drag>
              </div>
            </div>
            <div class="confirmed">
              <BaseButton
                icon
                iconSize="64px"
                :iconColor="player.isAgreeToTrade ? 'highlight' : 'warning'"
                :iconName="player.isAgreeToTrade ? 'check-circle-outline' : 'cancel'"
                @click="i === 0 && $emit('agree-trade')"
              />
            </div>
          </drop>
        </div>
        <div v-if="!withBank" class="select-resource">
          <h2>
            Asking For:
          </h2>
          <SelectResource asCarousel autoConfirm @resource-selected="$emit('declare-resource', $event)" />
          <div>
            <ResourceCard :resource="players[1].requestingResource" :clickable="false" hideCount big />
          </div>
        </div>
        <div v-if="!withBank" class="chat">
          <slot />
        </div>
      </div>
    </ActionCard>
  </v-dialog>
</template>

<script>
  import { resourceCardTypes } from '@/specs/resources';
  
  import ActionCard from '@/components/common/ActionCard';
  import BaseDeck from '@/components/game/BaseDeck';
  import ResourceCard from '@/components/game/ResourceCard';
  import SelectResource from '@/components/interface/SelectResource';
  import BaseButton from '@/components/common/BaseButton';
  import BaseAvatar from '@/components/common/BaseAvatar';

  export default {
    name: 'TradeDialog',
    components: {
      ActionCard,
      BaseDeck,
      ResourceCard,
      SelectResource,
      BaseButton,
      BaseAvatar
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      withBank: {
        type: Boolean,
        default: false
      },
      players: {
        type: Array,
        required: true
      },
      cancelText: {
        type: String,
        default: 'Refuse'
      }
    },
    created() {
      this.resourceCardTypes = resourceCardTypes;
    },
    methods: {
      renderKey(player) {
        const totalCurrentTradeCards = Object
          .values(player.tradeCounts || {})
          .reduce((r1, r2) => r1 + r2, 0);
          
        return `${player.playerSessionId}-${totalCurrentTradeCards}`;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wrapper {
    display: grid;
    grid-gap: 1%;
    grid-template-columns: 1fr;

    &.with-chat {
      grid-template-columns: 50% 24% 24%;
    }

    .trade-contents {
      padding: $spacer;
      display: flex;
      flex-direction: column;

      & > * {
        flex: 1;
        min-height: 100px;
        border-bottom: 1px solid $primary;

        &:last-of-type {
          border-bottom: 0;
        }
      }

      .my-deck {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .player {
        display: grid;
        grid-template-columns: 25% 60% 15%;
        align-items: center;
      }

      .trade-cards {
        display: flex;
      }
    }

    .select-resource {
      border-left: 1px solid $primary;
      padding-top: $spacer;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 200px;

      & > * {
        flex: 1;
      }
    }

    .chat {
      padding-left: $spacer / 2;
      border-left: 1px solid $primary;
      position: relative;
    }
  }

  .resource-type { 
    display: flex;
  }

  .resource-card {
    margin-left: $spacer / 3;
  }
</style>
