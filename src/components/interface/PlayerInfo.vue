<template>
  <div class="player" :style="playerStyle(player.color)">
    <div class="header">
      <div class="nickname">
        {{ player.nickname }}
      </div>
      <div class="status">
        <BaseButton
          v-if="isStarted && !isMe && !waitingTrade"
          icon
          iconName="swap-vertical-circle"
          iconSize="x-large"
          @click="$emit('trade-with', player.playerSessionId)"
        />
        <BaseButton
          v-if="allowStealing"
          icon
          iconName="hand-okay"
          iconSize="x-large"
          @click="$emit('steal-from', player.playerSessionId)"
        />
        <BaseIcon v-if="waitingTrade" name="head-dots-horizontal" size="32px" color="red" class="thinking" />
        <BaseIcon v-if="!isStarted" size="x-large" :color="player.isReady ? 'green' : 'red'" :name="player.isReady ? 'checkbox-marked-circle-outline' : 'do-not-disturb'" />
      </div>
    </div>
    <div class="resources" @click="$emit('deck-clicked')">
      <div v-for="pieceType in purchaseTypes" :key="pieceType" class="resource">
        <GamePiece 
          showCount
          :count="pieceType === 'gameCards' ? (player[pieceType].length) : player[pieceType]"
          :type="pieceType"
          :color="invertColor(player.color)"
        />
      </div>
    </div>
    <div class="resources" @click="$emit('deck-clicked')">
      <ResourceCounts :counts="player.resourceCounts" :hideCounts="!isMe" :clickable="isMe" />
    </div>
    <div class="belongings">
      <div class="game-cards">
        <GameCard
          v-for="(gameCard, index) in (player.gameCards || []).filter(({ type, wasPlayed }) => wasPlayed && type === CARD_KNIGHT)"
          :key="`${gameCard.type}-${index}`"
          :type="gameCard.type"
          wasPlayed
          :clickable="false"
          class="game-card"
        />
      </div>
      <div class="owned-harbors">
        <BaseIcon
          v-for="(harbor, resource) in player.ownedHarbors"
          :key="`owned-harbor-${resource}`"
          v-show="harbor"
          name="sail-boat"
          :color="resourceCardColors[resource] || '#3E2723'" size="32px"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import invertColor from 'invert-color';

  import { resourceCardTypes, resourceCardColors } from '@/specs/resources';
  import { pluralTypes as purchaseTypes } from '@/utils/buildingCosts';
  import { hexToRgb } from '@/utils/colors';
  import { CARD_KNIGHT } from '@/specs/gameCards';
  
  import ResourceCounts from '@/components/interface/ResourceCounts';
  import ResourceCard from '@/components/game/ResourceCard';
  import GamePiece from '@/components/game/GamePiece';
  import GameCard from '@/components/game/GameCard';
  
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'PlayerInfo.vue',
    components: {
      ResourceCounts,
      ResourceCard,
      GamePiece,
      GameCard,
      BaseButton,
      BaseIcon
    },
    props: {
      player: {
        type: Object,
        required: true
      },
      isStarted: {
        type: Boolean,
        default: false
      },
      isMe: {
        type: Boolean,
        default: false
      },
      waitingTrade: {
        type: Boolean,
        default: false
      },
      allowStealing: {
        type: Boolean,
        default: false
      }
    },
    created: function() {
      this.invertColor = invertColor;
      this.purchaseTypes = purchaseTypes;
      this.resourceCardTypes = resourceCardTypes;
      this.CARD_KNIGHT = CARD_KNIGHT;
      this.resourceCardColors = resourceCardColors;
    },
    methods: {
      playerStyle: function(playerColor) {
        const rgbPlayerColor = hexToRgb(playerColor);

        const style = {
          color: invertColor(playerColor),
          backgroundColor: `rgba(${rgbPlayerColor}, 0.25)`
        };

        if (this.isMe)
          style.backgroundColor = `rgba(${rgbPlayerColor}, 0.75)`

        return style;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  @keyframes slide-in-bck-center {
    0% {
      transform: translateZ(600px);
      opacity: 0;
    }
    100% {
      transform: translateZ(0);
      opacity: 1;
    }
  }

  .player {
    position: relative;
    padding: $spacer;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 30px;

    .header {
      display: flex;
      align-items: center;
      
      .nickname {
        flex: 2;
        font-weight: 700;
      }

      .status {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        .thinking {
          position: absolute;
          top: $spacer;
          right: $spacer;
        }
      }
    }

    .resources {
      display: flex;

      .resource {
        display: flex;

        .name {
          margin-bottom: $spacer;
        }
      }
    }

    .belongings {
      margin-top: $spacer / 2;
      display: flex;
    }

    .game-cards {
      margin-top: $spacer / 2;
      display: flex;

      .game-card {
        height: 40px;
      }
    }
  }

  .resource {
    & + & {
      margin-left: $spacer * 2;
    }
  }

  .resource-card {
    &.updated {
      animation: slide-in-bck-center 1.4s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
    }

    & + & {
      margin-left: $spacer;
    }
  }
</style>