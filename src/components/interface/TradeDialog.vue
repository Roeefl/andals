<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="900"
  >
    <ActionCard v-if="!!players[1]" :title="`Trading with ${players[1].nickname}`" :approve="false" :cancelText="cancelText" @cancel="$emit('refuse')">
      <div class="wrapper" :class="{ 'with-chat': !withBank }">
        <div class="trade">
          <drop @drop="$emit('remove-card', $event.resource)" class="my-deck" >
            <BaseDeck :deck="players[0].resourceCounts" @card-clicked="$emit('add-card', $event)" />
          </drop>
          <drop v-for="(player, i) in players" :key="renderKey(player)" @drop="i === 0 && $emit('add-card', $event)" class="player">
            <div class="nickname">
              {{ i === 0 ? 'You are' : `${player.nickname} is` }} offering:
            </div>
            <div class="trade-cards">
              <div v-for="resource in resourceCardTypes" :key="resource" v-show="player.tradeCounts && player.tradeCounts[resource]" class="resource-type">
                <drag 
                  v-for="(card, c) in Array(player.tradeCounts && player.tradeCounts[resource] > 0 ? player.tradeCounts[resource] : 0).fill(resource)"
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
                :color="player.isTradeConfirmed ? 'warning' : 'success'"
                :iconName="player.isTradeConfirmed ? 'cancel' : 'check-decagram'"
                @click="i === 0 && $emit('confirm-trade')"
              >
                {{ player.isTradeConfirmed ? 'Confirmed' : 'Confirm' }}
              </BaseButton>
            </div>
          </drop>
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
  
  import ResourceCard from '@/components/game/ResourceCard';
  import ActionCard from '@/components/common/ActionCard';
  import BaseDeck from '@/components/game/BaseDeck';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'TradeDialog',
    components: {
      ResourceCard,
      ActionCard,
      BaseDeck,
      BaseButton
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
    grid-template-columns: 1fr;

    &.with-chat {
      grid-template-columns: 70% 30%;
    }

    .trade {
      display: flex;
      flex-direction: column;

      .nickname {
        padding: $spacer / 2;
      }

      .my-deck {
        padding: $spacer;
        height: 100px;
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .player {
        height: 80px;
        display: grid;
        grid-template-columns: 20% 60% 20%;
        margin: $spacer 0;
        padding: $spacer 0;
        border-top: 1px solid black;
      }

      .trade-cards {
        display: flex;
      }
    }

    .chat {
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
