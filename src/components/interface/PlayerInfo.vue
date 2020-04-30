<template>
  <div class="player" :class="{ 'is-me': isMe, 'is-other': !isMe }" :style="playerStyle(player.color)">
    <div class="upper">
      <div class="header">
        <div class="avatar">
          <BaseAvatar :src="require(`../../assets/avatars/${player.avatar}.png`)" :alt="player.nickname" />
          <span class="nickname">
            {{ player.nickname }}
          </span>
        </div>
        <div class="status">
          <BaseChip
            v-if="!isGameReady"
            :iconName="player.isReady ? 'checkbox-marked-circle-outline' : 'do-not-disturb'"
            :iconColor="player.isReady ? 'highlight' : 'error'"
            :label="player.isReady ? 'Ready' : 'Not Ready'"
            @click="isMe && $emit('toggle-ready')"
            class="is-ready"
          />
          <BaseChip
            v-if="waitingTrade"
            icoName="head-dots-horizontal-outline"
            iconSize="32px"
            iconColor="info"
            label="Waiting..."
          />
          <BaseMenu
            v-if="isGameReady && !isMe"
            :isForceOpen="allowStealing"
            :items="opponentActions"
            @item-clicked="$emit($event, player.playerSessionId)"
            iconName="skew-more"
            class="opponent-actions"
          />
        </div>
      </div>
      <div class="game-pieces" @click="$emit('deck-clicked')">
        <div v-for="purchaseType in purchaseTypes" :key="purchaseType" class="resource">
          <GamePiece 
            showCount
            :count="player[purchaseType]"
            :type="purchaseType"
            :color="player.color"
            :size="isMe ? '30px' : '22px'"
          />
        </div>
        <div class="perks">
          <BaseIcon v-if="player.hasLongestRoad" name="highway" size="24px" color="primary" class="longest-road" />
          <BaseIcon v-if="player.hasLargestArmy" name="sword-cross" size="24px" color="primary" class="largest-army" />
        </div>
      </div>
      <div class="resources" @click="$emit('deck-clicked')">
        <ResourceCounts :collapsed="!isMe" :counts="player.resourceCounts" :hideCounts="!isMe" :clickable="isMe" />
      </div>
    </div>
    <div class="player-assets">
      <div class="belongings">
        <div class="game-cards">
          <ChoiceDialog
            :width="400"
            :hasCancel="false"
            buttonColor="transparent"
          >
            <template v-slot:activate>
              <GameCard
                v-for="(gameCard, index) in (player.gameCards || [])"
                :key="`${gameCard.type}-${index}`"
                :visible="isMe"
                :type="gameCard.type"
                :wasPlayed="gameCard.wasPlayed"
                :clickable="true"
                @clicked="displayedGameCard = gameCard"
                class="game-card"
              />
            </template>
            <GameCard full :visible="isMe" :type="displayedGameCard.type" :clickable="false" class="displayed-game-card" />
          </ChoiceDialog>
        </div>
        <div class="owned-harbors">
          <BaseIcon
            v-for="(harbor, resource) in player.ownedHarbors"
            :key="`owned-harbor-${resource}`"
            v-show="harbor"
            name="sail-boat"
            :color="resourceCardColors[resource] || 'secondary'" size="32px"
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

  import BaseIcon from '@/components/common/BaseIcon';
  import BaseAvatar from '@/components/common/BaseAvatar';
  import BaseChip from '@/components/common/BaseChip';
  import BaseMenu from '@/components/common/BaseMenu';

  import tileColors from '@/styles/export.scss';

  const playerActions = [
    {
      name: 'trade',
      title: 'Request Trade',
      icon: 'swap-vertical-circle',
      disabledKey: 'requestTradeDisabled',
      emit: 'trade-with'
    },
    {
      name: 'steal',
      title: 'Steal Card',
      icon: 'hand-okay',
      disabledKey: 'stealDisabled',
      emit: 'steal-from'
    }
  ];

  export default {
    name: 'PlayerInfo.vue',
    components: {
      ResourceCounts,
      ResourceCard,
      GamePiece,
      GameCard,
      ChoiceDialog,
      HeroCard,
      BaseIcon,
      BaseAvatar,
      BaseChip,
      BaseMenu
    },
    props: {
      player: {
        type: Object,
        required: true
      },
      isGameReady: {
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
    computed: {
      requestTradeDisabled: function() {
        return !this.enableTrading || this.waitingTrade;
      },
      stealDisabled: function() {
        return !this.allowStealing;
      },
      opponentActions: function() {
        return playerActions.map(action => {
          return {
            ...action,
            disabled: action.disabledKey && this[action.disabledKey]
          }
        });
      }
    },
    data: () => ({
      displayedGameCard: {}
    }),
    created() {
      this.purchaseTypes = purchaseTypes;
      this.resourceCardTypes = resourceCardTypes;
      this.resourceCardColors = resourceCardColors;

      console.log(this.player.currentHeroCard);
    },
    methods: {
      playerStyle: function(playerColor) {
        const backgroundRgb = hexToRgb(tileColors.primary);

        return {
          // color: playerColor,
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

  $hero-size: 70px;

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
    padding: $spacer / 2;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    border-radius: 30px;
    color: $secondary;

    &.is-me {
      padding: $spacer;
      
      .nickname {
        font-size: $base-font-size * 1.25;
      }
    }

    &.is-other {
      .resources {
        width: 50px;
      }
    }

    .upper {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .header {
      display: grid;
      grid-template-columns: 55% 45%;

      .avatar {
        height: 30px;
        display: flex;
        align-items: center;
        font-size: $font-size-sm;

        .nickname {
          @include text-truncate();
          margin-left: $spacer / 4;
        }
      }

      .status {
        justify-self: end;
      
        .is-ready {
          cursor: pointer;
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

    .game-pieces {
      display: flex;
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

  .displayed-game-card {
    height: 40vh;
  }
</style>