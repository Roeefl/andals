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
        <BaseBadge v-if="waitingTrade" color="red" content="........" icon="head-dots-horizontal" class="waiting" />
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
    <div class="resources cards" @click="$emit('deck-clicked')">
      <ResourceCounts :counts="player.resourceCounts" :hideCounts="!isMe" :clickable="isMe" />
    </div>
  </div>
</template>

<script>
  import invertColor from 'invert-color';

  import { resourceCardTypes } from '@/specs/resources';
  import { pluralTypes as purchaseTypes } from '@/utils/buildingCosts';
  
  import ResourceCounts from '@/components/interface/ResourceCounts';
  import ResourceCard from '@/components/game/ResourceCard';
  import GamePiece from '@/components/game/GamePiece';
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  import BaseBadge from '@/components/common/BaseBadge';

  export default {
    name: 'PlayerInfo.vue',
    components: {
      ResourceCounts,
      ResourceCard,
      GamePiece,
      BaseButton,
      BaseIcon,
      BaseBadge
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
    },
    methods: {
      hexToRgb: function(hex) {
        const noHashtag = hex.substr(1);
        
        const bigInt = parseInt(noHashtag, 16);

        const r = (bigInt >> 16) & 255;
        const g = (bigInt >> 8) & 255;
        const b = bigInt & 255;

        return `${r}, ${g}, ${b}`;
      },
      playerStyle: function(playerColor) {
        const rgbPlayerColor = this.hexToRgb(playerColor);

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
      width: 85%;
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