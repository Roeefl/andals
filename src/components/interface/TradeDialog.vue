<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="800"
  >
    <ActionCard v-if="!!players[1]" :title="`Trading with ${players[1].nickname}`" :approve="false" cancelText="Refuse" @cancel="$emit('refuse')">
      <div class="wrapper">
        <div class="my-deck">
          <Deck :deck="players[0].resourceCounts" @card-clicked="$emit('add-card', $event)" />
        </div>
        <div v-for="(player, i) in players" :key="renderKey(player)" class="player">
          <div class="nickname">
            {{ i === 0 ? 'You are' : `${player.nickname} is` }} offering:
          </div>
          <div class="trade-cards">
            <div v-for="resource in resourceCardTypes" :key="resource" v-show="player.tradeCounts[resource]" class="resource-type">
              <ResourceCard
                v-for="(card, i) in Array(player.tradeCounts[resource]).fill(resource)"
                :key="`card-${i}`"
                :resource="resource"
                hideCount
                big
                class="resource-card"
                @clicked="$emit('remove-card', resource)"
              />
            </div>
          </div>
          <div class="confirmed">
            <Button
              :color="player.isTradeConfirmed ? 'warning' : 'success'"
              :iconName="player.isTradeConfirmed ? 'cancel' : 'check-decagram'"
              @click="i === 0 && $emit('confirm-trade')"
            >
              {{ player.isTradeConfirmed ? 'Confirmed' : 'Confirm' }}
            </Button>
          </div>
        </div>
      </div>
    </ActionCard>
  </v-dialog>
</template>

<script>
  import { resourceCardTypes } from '@/utils/tileManifest';
  
  import ResourceCard from '@/components/game/ResourceCard';
  import ActionCard from '@/components/common/ActionCard';
  import Deck from '@/components/game/Deck';
  import Button from '@/components/common/Button';

  export default {
    name: 'TradeDialog',
    components: {
      ResourceCard,
      ActionCard,
      Deck,
      Button
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      players: {
        type: Array,
        required: true
      }
    },
    created() {
      this.resourceCardTypes = resourceCardTypes;
    },
    methods: {
      renderKey(player) {
        const totalCurrentTradeCards = Object.values(player.tradeCounts).reduce((r1, r2) => r1 + r2, 0);
        return `${player.playerSessionId}-${totalCurrentTradeCards}`;
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .wrapper {
    display: flex;
    flex-direction: column;

    .my-deck {
      height: 80px;
      display: flex;
      align-items: center;
    }

    .player {
      height: 80px;
      display: grid;
      grid-template-columns: 30% 50% 20%;
      margin: $spacer 0;
      padding: $spacer 0;
      border-top: 1px solid black;
    }

    .trade-cards {
      display: flex;
    }
  }

  .resource-type { 
    display: flex;
    margin-left: $spacer;
  }

  .resource-card {
    & + & {
      margin-left: $spacer * 2;
    }
  }

</style>
