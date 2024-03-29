<script>
  import { resourceCardTypes, resourceCardColors } from '@/specs/resources';
  import { hexToRgb } from '@/utils/colors';
  import { CARD_VICTORY_POINT } from '@/specs/gameCards';
  
  import TurnAction from '@/containers/TurnAction';
  import ResourceCard from '@/components/game/ResourceCard';
  import GamePiece from '@/components/game/GamePiece';
  import GameCard from '@/components/game/GameCard';
  import HeroCard from '@/components/game/HeroCard';
  import GameCardDialog from '@/components/interface/GameCardDialog';

  import BaseIcon from '@/components/common/BaseIcon';
  import BaseAvatar from '@/components/common/BaseAvatar';
  import BaseChip from '@/components/common/BaseChip';
  import BaseMenu from '@/components/common/BaseMenu';
  import BaseButton from '@/components/common/BaseButton';

  import tileColors from '@/styles/export.scss';

  // const playerActions = [
  //   {
  //     name: 'trade',
  //     title: 'Request Trade',
  //     icon: 'swap-vertical-circle',
  //     disabledKey: 'requestTradeDisabled',
  //     emit: 'trade-with'
  //   },
  //   // {
  //   //   name: 'steal',
  //   //   title: 'Steal Card',
  //   //   icon: 'hand-okay',
  //   //   disabledKey: 'stealDisabled',
  //   //   emit: 'steal-from'
  //   // }
  // ];

  export default {
    name: 'PlayerInfo.vue',
    components: {
      ResourceCard,
      GamePiece,
      TurnAction,
      GameCard,
      GameCardDialog,
      HeroCard,
      BaseIcon,
      BaseAvatar,
      BaseChip,
      BaseMenu,
      BaseButton
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
      isGameStarted: {
        type: Boolean,
        default: false
      },
      waitingTrade: {
        type: Boolean,
        default: false
      },
      allowRequestTrade: {
        type: Boolean,
        default: false
      },
      isMyTurn: {
        type: Boolean,
        default: false  
      },
      currentRound: {
        type: Number,
        default: -1
      }
    },
    data: () => ({
      displayedGameCard: {}
    }),
    computed: {
      playGameCardAllowed: function() {
        return (
          this.isGameStarted &&
          this.isMe &&
          this.isMyTurn &&
          !this.player.hasPlayedGameCard &&
          !this.displayedGameCard.wasPlayed &&
          this.displayedGameCard.purchasedRound !== this.currentRound &&
          this.displayedGameCard.type && this.displayedGameCard.type !== CARD_VICTORY_POINT
        );
      },
      requestTradeDisabled: function() {
        return !this.allowRequestTrade;
      },
      // opponentActions: function() {
      //   return playerActions.map(action => {
      //     return {
      //       ...action,
      //       disabled: action.disabledKey && this[action.disabledKey]
      //     }
      //   });
      // }
    },
    created() {
      this.resourceCardTypes = resourceCardTypes;
      this.resourceCardColors = resourceCardColors;
    },
    methods: {
      playerStyle: function(playerColor) {
        const backgroundRgb = hexToRgb(tileColors.info);

        return {
          '--player-color': playerColor,
          backgroundColor: this.isMe
            ? `rgba(${backgroundRgb}, 0.4)`
            : `rgba(${backgroundRgb}, 0.7)`,
          color: this.isMe
            ? tileColors.primary
            : playerColor
        };
      },
      playGameCard: function() {
        if (!this.isMe) return;
        
        this.$emit('play-card', this.displayedGameCard);
        this.displayedGameCard = {};
      }
    }
  }
</script>

<template>
  <div class="player" :class="{ 'is-me': isMe}" :style="playerStyle(player.color)">
    <div class="upper">
      <div class="header">
        <div class="avatar">
          <BaseAvatar :size="64" :src="require(`../../assets/avatars/${player.avatar || 1}.png`)" :alt="player.nickname" />
          <span class="nickname">
            {{ player.nickname }}
          </span>
        </div>
        <div class="status">
          <BaseChip
            v-if="!isGameReady"
            :disabled="!isMe"
            :iconName="player.isReady ? 'checkbox-marked-circle-outline' : 'do-not-disturb'"
            :iconColor="player.isReady ? 'highlight' : 'warning'"
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
        </div>
      </div>
      <div v-if="isMe" class="perks">
        <BaseIcon v-if="player.hasLongestRoad" name="highway" size="24px" color="primary" class="longest-road" />
        <BaseIcon v-if="player.hasLargestArmy" name="sword-cross" size="24px" color="primary" class="largest-army" />
      </div>
      <div v-if="player.resourceCounts" @click="$emit('deck-clicked')" class="resource-cards">
        <fragment v-for="resource in resourceCardTypes" :key="`resource-${resource}`">
          <!-- .filter(resource => player.resourceCounts[resource] > 0) -->
          <ResourceCard
            v-for="(resourceCard, index) in Array(player.resourceCounts[resource]).fill(resource)"
            :key="`card-${resource}-${index}`"
            :resource="resource"
            small
            hideCount
            :hideIcon="!isMe"
            :clickable="isMe"
            class="resource-card"
            :class="{ 'my-resource-card': isMe }"
          />
        </fragment>
      </div>
      <div class="player-assets">
        <div class="belongings">
          <div class="game-cards">
            <GameCard
              v-for="(gameCard, index) in (player.gameCards || [])"
              :key="`${gameCard.type}-${index}`"
              :visible="isMe"
              :type="gameCard.type"
              :wasPlayed="gameCard.wasPlayed"
              :clickable="true"
              @clicked="displayedGameCard = isMe ? { ...gameCard, index } : {}"
              class="game-card"
            />
          </div>
          <div class="owned-harbors">
            <BaseIcon
              v-for="(harbor, resource) in (player.ownedHarbors || [])"
              :key="`owned-harbor-${resource}`"
              v-show="harbor"
              name="sail-boat"
              :color="resourceCardColors[resource] || 'secondary'" size="32px"
            />
          </div>
        </div>
        <div class="hero-card-wrapper" :class="{ 'was-played': player.currentHeroCard.wasPlayed }">
          <BaseButton color="transparent" height="auto" @click="$emit('display-hero-card', player.currentHeroCard)" class="hero-card-button">
            <HeroCard thumbnail :card="player.currentHeroCard" class="hero-card" />
          </BaseButton>
          <BaseIcon v-show="player.currentHeroCard.wasPlayed" name="circle-half-full" size="36px" color="primary" class="icon-was-played" />
        </div>
      </div>
    </div>
    <div v-if="isMe" class="turn-action">
      <TurnAction :isGameReady="isGameReady" :myPlayer="player" @toggle-ready="$emit('toggle-ready')" />
    </div>
    <GameCardDialog
      v-if="!!displayedGameCard.type"
      :isOpen="!!displayedGameCard.type"
      :type="displayedGameCard.type"
      :playAllowed="playGameCardAllowed"
      @dismiss="displayedGameCard = {}"
      @play="playGameCard"
    />
    <BaseButton
      v-if="!isMe"
      key="trade"
      icon
      iconName="swap-horizontal-circle"
      iconColor="#E64A19"
      iconSize="60px"
      :disabled="requestTradeDisabled"
      @click="$emit('trade-with', player.playerSessionId)"
      class="trade-with"
    />
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  $hero-size: 70px;

  .player {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: hidden;
    border-radius: 30px;
    border: 4px solid $primary;
    color: $secondary;
    position: relative;

    @include md-down() {
      justify-content: flex-start;
    }

    .upper {
      display: flex;
      flex-direction: column;

      .header {
        display: flex;

        .avatar {
          height: 70px;
          display: flex;
          align-items: center;
          font-size: $font-size-sm;

          .nickname {
            // max-width: 90%;
            // color: $primary;
            font-weight: bold;
            @include text-truncate();
            font-size: $font-size-md;
            margin-left: $spacer / 4;
          }
        }

        .status {
          position: absolute;
          right: $spacer / 4;
          top: $spacer / -4;
          
          .is-ready {
            cursor: pointer;
          }
        }
      }

      .perks {
        display: flex;
      }

      .resource-cards {
        display: flex;
        max-width: 220px;
        overflow-x: hidden;
      }

      .player-assets {
        margin-top: $spacer / 2;
        display: flex;

        .belongings {
          flex: 1;
          display: flex;
          flex-direction: column;

          .game-cards {
            margin-top: $spacer / 2;
            display: flex;
      
            .game-card {
              height: 50px;
            }
          }

          .owned-harbors {
            margin-top: $spacer / 2;
            display: flex;
          }
        }

        .hero-card-wrapper {
          flex: 1;
          height: $hero-size;
          overflow: hidden;
          position: relative;
          display: flex;
          justify-content: flex-end;

          &.was-played {
            opacity: 0.75;
          }

          .hero-card-button {
            padding: 0;
          }

          .icon-was-played {
            position: absolute;
            top: 0;
            right: 0;
          }
        }

        .hero-card {
          width: $hero-size;
          height: $hero-size;
          background: $secondary;
          color: $primary;
        }
      }
    }
    
    .turn-action {
      display: flex;
      justify-content: center;
      margin-bottom: $spacer / 2;
    }

    &.is-me {
      .upper {
        .header {
          margin-bottom: $spacer;

          .avatar {
            padding-top: $spacer * 2;
            height: 60px;
            font-size: $font-size-lg;

            .nickname {
              max-width: 160px;
              font-size: $font-size-lg;
            }
          }
        }
        
        .resource-cards {
          max-height: 100px;
          overflow-y: hidden;
          flex-flow: row wrap;
          max-width: auto;
          overflow-x: unset;
          padding-left: $spacer / 2;
        }

        .player-assets {
          .hero-card-wrapper {
            height: $hero-size * 1.75;
          }
  
          .hero-card {
            width: $hero-size * 1.75;
            height: $hero-size * 1.75;
          }
        }
      }
    }

    .trade-with {
      position: absolute;
      bottom: $spacer;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .game-piece {
    & + & {
      margin-left: $spacer * 0.5;
    }
  }

  .resource-card {
    &.updated {
      animation: slide-in-bck-center 1.4s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
    }

    & + & {
      margin-left: $spacer * -1;
    }

    &.my-resource-card {
      margin-left: $spacer * -0.5;
    }
  }

  .game-card {
    & + & {
      margin-left: $spacer / 2;
    }
  }
</style>