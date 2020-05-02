<template>
  <div class="player" :class="{ 'is-me': isMe}" :style="playerStyle(player.color)">
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
          />
        </div>
      </div>
      <div v-if="isMe" class="game-pieces" @click="$emit('deck-clicked')">
        <div v-for="purchaseType in purchaseTypes" :key="purchaseType" class="game-piece">
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
      <div @click="$emit('deck-clicked')" class="resource-cards">
        <fragment v-for="resource in resourceCardTypes" :key="`resource-${resource}`" v-show="player.resourceCounts && player.resourceCounts[resource] > 0">
          <ResourceCard
            v-for="(resourceCard, index) in Array((player.resourceCounts || {})[resource]).fill(resource)"
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
          :width="600"
          buttonColor="transparent"
          :hasCancel="isMe && isMyTurn && !player.hasPlayedHeroCard"
          cancelColor="warning"
          :cancelText="`Play and discard`"
          @cancel="$emit('play-hero', true)"
          :hasApprove="isMe && isMyTurn && !player.currentHeroCard.wasPlayed && !player.hasPlayedHeroCard"
          approveColor="error"
          :approveText="`Play and flip for a subsequent use`"
          @approve="$emit('play-hero', false)"
        >
          <template v-slot:activate>
            <HeroCard thumbnail :card="player.currentHeroCard" class="hero-card" />
          </template>
          <HeroCard :card="player.currentHeroCard" />
        </ChoiceDialog>
      </div>
    </div>
    <GameCardDialog
      v-if="!!displayedGameCard.type"
      :isOpen="!!displayedGameCard.type"
      :type="displayedGameCard.type"
      :playAllowed="playGameCardAllowed"
      @dismiss="displayedGameCard = {}"
      @play="playGameCard"
    />
  </div>
</template>

<script>
  import invertColor from 'invert-color';

  import { resourceCardTypes, resourceCardColors } from '@/specs/resources';
  import { pluralTypes as purchaseTypes } from '@/specs/purchases';
  import { hexToRgb } from '@/utils/colors';
  import { CARD_VICTORY_POINT } from '@/specs/gameCards';
  
  import ResourceCard from '@/components/game/ResourceCard';
  import GamePiece from '@/components/game/GamePiece';
  import GameCard from '@/components/game/GameCard';
  import HeroCard from '@/components/game/HeroCard';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import GameCardDialog from '@/components/interface/GameCardDialog';

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
      ResourceCard,
      GamePiece,
      GameCard,
      ChoiceDialog,
      GameCardDialog,
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
    data: () => ({
      displayedGameCard: {}
    }),
    computed: {
      playGameCardAllowed: function() {
        return (
          this.isMyTurn &&
          this.isMe && 
          !this.player.hasPlayedGameCard &&
          this.displayedGameCard.type && this.displayedGameCard.type !== CARD_VICTORY_POINT
        );
      },
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
    created() {
      this.purchaseTypes = purchaseTypes;
      this.resourceCardTypes = resourceCardTypes;
      this.resourceCardColors = resourceCardColors;
    },
    methods: {
      playerStyle: function(playerColor) {
        const backgroundRgb = hexToRgb(tileColors.info);

        return {
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
    padding: $spacer;

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
          font-size: $font-size-md;
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

    .resource-cards {
      display: flex;
      max-width: 220px;
      overflow-x: hidden;
    }

    &.is-me {
      .resource-cards {
        flex-flow: row wrap;
        max-width: auto;
        overflow-x: unset;
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
            height: 50px;
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
        background: $secondary;
        color: $primary;
      }
    }
  }

  .game-piece {
    & + & {
      margin-left: $spacer * 1.5;
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