<template>
  <div class="player" :class="{ 'is-me': isMe }" :style="playerStyle(player.color)">
    <div class="header">
      <div class="nickname">
        {{ player.nickname }}
      </div>
      <div class="status">
        <BaseButton
          v-if="isStarted && !isMe && !waitingTrade"
          icon
          iconName="swap-vertical-circle"
          iconSize="32px"
          :iconColor="player.color"
          :clickable="enableTrading"
          @click="$emit('trade-with', player.playerSessionId)"
        />
        <BaseButton
          v-if="allowStealing"
          icon
          iconName="hand-okay"
          iconSize="x-large"
          :iconColor="player.color"
          @click="$emit('steal-from', player.playerSessionId)"
        />
        <BaseIcon v-if="player.hasLongestRoad" name="highway" size="24px" color="black" class="longest-road" />
        <BaseIcon v-if="player.hasLargestArmy" name="sword-cross" size="24px" color="black" class="largest-army" />
        <BaseIcon v-if="waitingTrade" name="head-dots-horizontal" size="32px" color="red" class="thinking" />
        <BaseIcon v-if="!isStarted" size="x-large" :color="player.isReady ? 'green' : 'red'" :name="player.isReady ? 'checkbox-marked-circle-outline' : 'do-not-disturb'" />
      </div>
    </div>
    <div class="resources" @click="$emit('deck-clicked')">
      <div v-for="purchaseType in purchaseTypes" :key="purchaseType" class="resource">
        <GamePiece 
          showCount
          :count="player[purchaseType]"
          :type="purchaseType"
          :color="player.color"
          :size="isMe ? '30px' : '22px'"
        />
      </div>
    </div>
    <div class="resources" @click="$emit('deck-clicked')">
      <ResourceCounts :small="!isMe" :counts="player.resourceCounts" :hideCounts="!isMe" :clickable="isMe" />
    </div>
    <div class="player-assets">
      <div class="belongings">
        <div class="game-cards">
          <GameCard
            v-for="(gameCard, index) in (player.gameCards || [])"
            :key="`${gameCard.type}-${index}`"
            :visible="isMe"
            :clickable="false"
            :type="gameCard.type"
            :wasPlayed="gameCard.wasPlayed"
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
      <div class="hero-card-wrapper">
        <ChoiceDialog
          :width="500"
          buttonColor="transparent"
          :hasCancel="isMe && isMyTurn && !player.hasPlayedHeroCard"
          :cancelText="`Play ${player.currentHeroCard.name} and discard it`"
          @cancel="$emit('play-hero', true)"
          :hasApprove="isMe && isMyTurn && !player.currentHeroCard.wasPlayed && !player.hasPlayedHeroCard"
          :approveText="`Play ${player.currentHeroCard.name} and flip it for a subsequent use`"
          @approve="$emit('play-hero', false)"
        >
          <template v-slot:activate>
            <HeroCard thumbnail :card="player.currentHeroCard" class="hero-card" />
          </template>
          <HeroCard :card="player.currentHeroCard" />
        </ChoiceDialog>
      </div>
    </div>
  </div>
</template>

<script>
  import invertColor from 'invert-color';

  import { resourceCardTypes, resourceCardColors } from '@/specs/resources';
  import { pluralTypes as purchaseTypes } from '@/specs/purchases';
  import { hexToRgb } from '@/utils/colors';
  import { CARD_KNIGHT } from '@/specs/gameCards';
  
  import ResourceCounts from '@/components/interface/ResourceCounts';
  import ResourceCard from '@/components/game/ResourceCard';
  import GamePiece from '@/components/game/GamePiece';
  import GameCard from '@/components/game/GameCard';
  import HeroCard from '@/components/game/HeroCard';
  import ChoiceDialog from '@/components/common/ChoiceDialog';

  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';

  import tileColors from '@/styles/export.scss';

  export default {
    name: 'PlayerInfo.vue',
    components: {
      ResourceCounts,
      ResourceCard,
      GamePiece,
      GameCard,
      ChoiceDialog,
      HeroCard,
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
      enableTrading: {
        type: Boolean,
        default: true
      },
      waitingTrade: {
        type: Boolean,
        default: false
      },
      allowStealing: {
        type: Boolean,
        default: false
      },
      isMyTurn: {
        type: Boolean,
        default: false  
      }
    },
    created() {
      this.purchaseTypes = purchaseTypes;
      this.resourceCardTypes = resourceCardTypes;
      this.resourceCardColors = resourceCardColors;
    },
    methods: {
      playerStyle: function(playerColor) {
        const backgroundRgb = hexToRgb(tileColors.primary);

        return {
          color: playerColor,
          backgroundColor: this.isMe
            ? `rgba(${backgroundRgb}, 0.7)`
            : tileColors.primary
        };
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $hero-size: 86px;

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
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    border-radius: 30px;

    &.is-me {
      .header {
        font-size: $font-size-md;
        font-weight: 900;
      }
    }

    .header {
      display: flex;
      align-items: center;
      font-size: $font-size-sm;
      
      .nickname {
        flex: 2;
      }

      .status {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        position: absolute;
        top: $spacer;
        right: $spacer;

        & > * {
          margin-left: $spacer / 2;
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

    .player-assets {
      margin-top: $spacer / 2;
      display: flex;

      .belongings {
        flex: 3;
        display: flex;
        flex-direction: column;

        .game-cards {
          margin-top: $spacer / 2;
          display: flex;
    
          .game-card {
            height: 40px;
          }
        }

        .owned-harbors {
          margin-top: $spacer / 2;
          display: flex;
        }
      }

      .hero-card-wrapper {
        flex: 2;
        height: $hero-size;
        overflow: hidden;
      }

      .hero-card {
        width: $hero-size;
        height: $hero-size;
      }
    }
  }

  .resource {
    & + & {
      margin-left: $spacer;
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